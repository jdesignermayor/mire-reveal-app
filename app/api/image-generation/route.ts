import { NextRequest, NextResponse } from "next/server";
import { getIllustrationById, IllustrationResponse } from "@/actions/illustrations";
import { ILLUSTRATION_STATUS, ImageDataFormat } from "@/models/illustration.model";
import { supabaseServer } from "@/lib/supabase/server";
import { Json } from "@/lib/supabase/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DBTableList } from "@/lib/db.schema";

const HEADERS_CORS = {
    "Access-Control-Allow-Origin":
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cross-Origin-Resource-Policy": "same-origin",
};

const UNPROCESSED_IMAGES_BUCKET = "profile_assets";
const PROCESSED_IMAGES_BUCKET = "illustrations";
const IMAGE_MIMETYPE = "image/jpeg";
const MODEL_NAME = process.env.MIRE_CURRENT_MODEL || "";
export const IMAGE_URL_EXPIRE_TIME = 60 * 60 * 24 * 365;

export async function insertModelHistory({ usageMetadata, illustrationId, imageId, base64_image }: { usageMetadata: Json, illustrationId: number, imageId: string, base64_image: string }) {
    const supabase = await supabaseServer();
    console.log('insertModelHistory', usageMetadata, illustrationId);
    try {

        await supabase.from('tbl_expense_model_history')
            .insert({
                json_response: usageMetadata,
                model_name: MODEL_NAME,
                illustration_id: illustrationId.toString(),
                image_id: imageId,
                type: 'image_generation',
                base64_image,
            }).single();

    } catch (error) {
        console.log("Error inserting model history:", error);
        throw Error("Error inserting model history");
    }
}

const setIllustrationIntoStorage = async ({ illustrationId, imageId, processedImageBase64 }: { illustrationId: number, imageId: string, processedImageBase64: string }): Promise<{ path: string, fullPath: string, publicUrl: string }> => {
    const supabase = await supabaseServer();

    const imageName = `${illustrationId}-${imageId}-${Date.now()}.jpg`;
    const { data: dataStorage, error } = await supabase.storage
        .from(PROCESSED_IMAGES_BUCKET)
        .upload(imageName, Buffer.from(processedImageBase64, "base64"), {
            contentType: IMAGE_MIMETYPE,
            upsert: false,
        });


    if (!dataStorage?.path || error) {
        console.log("Error uploading image:", error);
        return {
            path: '',
            fullPath: '',
            publicUrl: '',
        }
    }

    const { data: dataSignedUrl } = await supabase.storage
        .from(PROCESSED_IMAGES_BUCKET)
        .createSignedUrl(dataStorage.path, IMAGE_URL_EXPIRE_TIME);

    if(!dataSignedUrl?.signedUrl){
        console.log("Error creating signed URL for image:", error);
        return {
            path: '',
            fullPath: '',
            publicUrl: '',
        }
    }

    return {
        path: dataStorage.path,
        fullPath: dataStorage.fullPath,
        publicUrl: dataSignedUrl?.signedUrl,
    }
}

const updateIllustrationImage = async ({ illustrationId, imageId, state, processedImageBase64 }: { illustrationId: number, imageId: string, state: 'SUCCESS' | 'FAILED', processedImageBase64: string }) => {
    const supabase = await supabaseServer();
    const illustration = await getIllustrationById(illustrationId);

    const { path, fullPath, publicUrl } = await setIllustrationIntoStorage({ illustrationId, imageId, processedImageBase64 });

    const illustrationImages = illustration.data?.images as unknown as ImageDataFormat[];
    const illustrationImage = illustrationImages.map((image) => {
        if (image.id === imageId) {
            return {
                ...image,
                images: {
                    ...image.images,
                    processed: {
                        path,
                        fullPath,
                        publicUrl,
                    },
                },
                isFinished: state === 'SUCCESS',
                isFailed: state === 'FAILED',
                isPending: false,
            }
        }

        return image;
    });


    const allIllustrationImagesFinished = illustrationImage.every((image) => image.isFinished);

    await supabase.from(DBTableList.ILLUSTRATIONS)
        .update({
            images: illustrationImage as unknown as Json,
            process_status: allIllustrationImagesFinished ? ILLUSTRATION_STATUS.COMPLETED : ILLUSTRATION_STATUS.PROCESSING,
        })
        .eq("id", illustrationId);

    console.log('illustrationImage:', illustrationImage);
}

export async function getBase64ImageFromPath(url: string) {
    try {
        const supabase = await supabaseServer();
        const { data } = await supabase
            .storage
            .from(UNPROCESSED_IMAGES_BUCKET)
            .download(url);

        if (!data) {
            throw new Error("Image not found");
        }

        const buffer = Buffer.from(await data.arrayBuffer());
        const bufferString = buffer.toString("base64");
        return bufferString;
    } catch (error) {
        console.log("Error fetching image:", error);
        return null;
    }
}

export async function processImageWithGemini({ illustrationId, imageId, imagePath, gestationalWeek, ethnicity, gender }: { illustrationId: number, imageId: string, imagePath: string, gestationalWeek: number, ethnicity: string, gender: string }): Promise<{ generatedBase64Image: string }> {
    try {
        console.log(
            `Processing image in GEMINI current path: ${imagePath}`,
        );

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const base64Image = await getBase64ImageFromPath(imagePath);

        if (!base64Image) {
            throw new Error("Image not found");
        }

        // Prompt to transform ultrasound to artistic baby illustration
        const prompt = `Generate a photorealistic reconstruction strictly based on this 3D fetal ultrasound image.
        Preserve 100% of the original anatomy, facial structure, proportions, and exact fetal pose, exact nose, exact lips. Do not modify position, expression, angle, or orientation in any way.
        The output must look like a realistic ${gestationalWeek} week gestational age baby, medically accurate and developmentally consistent.
        Maintain natural ${ethnicity} ethnic traits without exaggeration and gender ${gender} .
        NON NEGOTIABLE: The baby skin tone must be like a newborn baby with white skin tone(depending on the ethnicity ${ethnicity}), baby eyes are closed always.
        No artistic interpretation, no beautification, no stylization — only a realistic enhancement of the original scan into true-to-life photographic detail.`;

        // Correct multimodal Gemini request
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64Image,
                                mimeType: IMAGE_MIMETYPE,
                            },
                        },
                    ],
                },
            ],
        });

        const response = result.response;
        let generatedBase64Image = "";
        const candidates = response.candidates || [];

        if (candidates.length > 0) {
            const parts = candidates[0].content?.parts || [];
            for (const part of parts) {
                if (part.inlineData && part.inlineData.data) {
                    generatedBase64Image = part.inlineData.data;
                    break;
                }
            }
        }

        const usageMetadata = response.usageMetadata || {}

        await insertModelHistory({
            usageMetadata,
            illustrationId: illustrationId,
            imageId: imageId,
            base64_image: generatedBase64Image
        });

        await updateIllustrationImage({ illustrationId, imageId, state: 'SUCCESS', processedImageBase64: generatedBase64Image });

        return {
            generatedBase64Image
        }

    } catch (error) {
        throw new Error(
            `Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await supabaseServer();
        const body: IllustrationResponse = await req.json();

        const illustrationId = body.id;

        // Update illustration status to PROCESSING
        // await supabase
        //   .from('tbl_illustrations')
        //   .update({
        //     process_status: ILLUSTRATION_STATUS.PROCESSING,
        //   })
        //   .eq("id", body.id);

        // console.log(`Updated illustration ${body.id} status to PROCESSING`);

        // // Process each image in the illustration
        // const images = body.images as unknown as ImageDataFormat[];
        // const processedResults = [];

        // console.log('images:', images);

        // Update illustration status to COMPLETED
        // await supabase
        //   .from('tbl_illustrations')
        //   .update({
        //     process_status: ILLUSTRATION_STATUS.COMPLETED,
        //     completed_at: new Date().toISOString(),
        //   })
        //   .eq("id", body.id);

        // console.log(`Completed processing illustration ${body.id}`);

        return NextResponse.json({
            message: 'Illustration processed successfully',
            illustrationId: body.id,
            results: '',
        }, {
            status: 200,
            headers: HEADERS_CORS,
        });

    } catch (error) {
        console.error('Error processing illustration:', error);
        return NextResponse.json({
            message: 'Error processing illustration',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, {
            status: 500,
            headers: HEADERS_CORS,
        });
    }
}
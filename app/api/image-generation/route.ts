import { NextRequest, NextResponse } from "next/server";
import { getIllustrationById, IllustrationResponse } from "@/actions/illustrations";
import { ILLUSTRATION_STATUS, ImageDataFormat } from "@/models/illustration.model";
import fs from "fs";
import path from "path";
import sharp from "sharp";
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

async function applyWatermark(base64Image: string): Promise<Buffer> {
    const inputBuffer = Buffer.from(base64Image, "base64");
    const { width = 1024, height = 1024 } = await sharp(inputBuffer).metadata();

    const logoSize = Math.round(Math.min(width, height) * 0.18);
    const margin = Math.round(Math.min(width, height) * 0.04);

    const svgLogo = `
        <svg width="${logoSize}" height="${logoSize}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" opacity="0.45">
            <circle cx="50" cy="50" r="44" fill="none" stroke="white" stroke-width="6" />
            <text x="50" y="57" font-family="Georgia, serif" font-size="28" font-weight="bold"
                fill="white" text-anchor="middle" letter-spacing="2">MIRE</text>
            <line x1="18" y1="67" x2="82" y2="67" stroke="white" stroke-width="2" />
            <text x="50" y="80" font-family="Georgia, serif" font-size="11"
                fill="white" text-anchor="middle" letter-spacing="3">REVEAL</text>
        </svg>`;

    const logoBuffer = await sharp(Buffer.from(svgLogo))
        .resize(logoSize, logoSize)
        .png()
        .toBuffer();

    return sharp(inputBuffer)
        .composite([{
            input: logoBuffer,
            gravity: "southeast",
            blend: "over",
            left: width - logoSize - margin,
            top: height - logoSize - margin,
        }])
        .withMetadata()
        .jpeg({ quality: 92 })
        .toBuffer();
}

const setIllustrationIntoStorage = async ({ illustrationId, imageId, processedImageBase64 }: { illustrationId: number, imageId: string, processedImageBase64: string }): Promise<{ path: string, fullPath: string, publicUrl: string }> => {
    const supabase = await supabaseServer();

    const watermarkedBuffer = await applyWatermark(processedImageBase64);

    const imageName = `${illustrationId}-${imageId}-${Date.now()}.jpg`;
    const { data: dataStorage, error } = await supabase.storage
        .from(PROCESSED_IMAGES_BUCKET)
        .upload(imageName, watermarkedBuffer, {
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

     
        // PROMPT FORMULA = [action/change] + [specific element to change] + [desired style/effect] + [relevant details]
        // ACTION WORDS = Add, Change, Make, Remove, Replace
        const editingImagePrompt = `
        Task: High-fidelity photographic skin-render of a 3D fetal ultrasound scan.
        Input Constraints: Use the provided 3D ultrasound image as the absolute structural template. You must map a realistic photographic texture onto the exact morphology of the scan.
        Anatomical Fidelity (Strict):
        Zero Alteration: Maintain the exact bulbousness of the nose, the specific thickness and curve of the lips, and the unique jawline shown in the scan.
        Pose: Do not change the tilt of the head or the position of the hands. If a hand is near the face, it must remain exactly there.
        Eyes: Must remain tightly closed with realistic eyelid creases, consistent with a fetus in the womb.
        Medical Realism:
        Developmental Accuracy: The baby must look like a ${gestationalWeek}-week fetus. Adjust skin texture to reflect this age (slight vernix or translucent quality if applicable).
        Demographics: Natural ${ethnicity} skin tones and ${gender} features.
        Skin Texture: Avoid "porcelain" or "perfect" skin. Use realistic newborn skin textures: subtle mottling, fine pores, and natural skin folds.
        Aesthetic Style: > * Lighting: Soft, diffused womb-like lighting (warm tones, cinematic subsurface scattering).
        Eliminate: No artistic smoothing, no "AI-beautification", no stock-photo face.
        Remove: No interpretable body parts.
        Output: A raw, hyper-realistic photographic reconstruction that looks like a real photo of the fetus from the scan.
        `;

        // Correct multimodal Gemini request
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: editingImagePrompt },
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
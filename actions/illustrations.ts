"use server";

import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { getSettings } from "./settings";
import { IllustrationFormData } from "@/components/features/illustration/RevealIllustrationForm";
import { Illustration, ILLUSTRATION_STATUS, ImageDataFormat, ImageFormat, ImageUploaded } from "@/models/illustration.model";

const UNPROCESSED_IMAGES_BUCKET = "profile_assets";

type Json = Database['public']['Tables']['tbl_illustrations']['Row']['images'];

type IllustrationInsert = Omit<Illustration, "id" | "created_at">;

export type IllustrationResponse = Illustration & { id: number };

async function getUserName(userId: string | null): Promise<string> {
    if (!userId) return "Usuario Desconocidos";
    const supabase = await supabaseServer();
    const { data, error } = await supabase.from(DBTableList.PROFILES).select("name").eq("uuid_user", userId).single();
    return data?.name || "Usuario Desconocidos";
}

export async function getIllustrations(): Promise<Illustration[]> {
    try {
        const supabase = await supabaseServer();
        const settings = await getSettings();
        if (!settings?.company) {
            return [];
        }

        const { company } = settings;

        let query = supabase.from(DBTableList.ILLUSTRATIONS).select("*").eq("company_id", company.id).order("created_at", { ascending: false });

        // TODO: Add team filtering when teamId is available
        // if(teamId){
        //     query = query.eq("team_id", teamId);
        // }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching illustrations:", error);
            return [];
        }

        const computedData = await Promise.all(
            data?.map(async (ill) => ({
                ...ill,
                user_name: await getUserName(ill.profile_id),
            })) || []
        )

        return computedData;
    }
    catch (error) {
        console.log("Error fetching illustrations:", error);
        return [];
    }
}

export async function getIllustrationById(id: number) {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
        .from(DBTableList.ILLUSTRATIONS)
        .select("*")
        .eq("id", id)
        .single();

    try {
        if (error) {
            return { error: error.message, data: null };
        }

        return { data: data, error: null };
    } catch (error) {
        return { error: error, data: null };
    }
}

const processedImageData: ImageUploaded = {
    path: "public/demo-image-transformed.jpg",
    publicUrl: "/images/demo-image-transformed.jpg",
    fullPath: "public/demo-image-transformed.jpg",
};

// // Función para procesar imagen con Gemini API
// async function processImageWithGemini(image: ImageUploaded): Promise<ImageUploaded> {
//     try {
//         console.log('Processing image with Gemini:', image.publicUrl);
        
//         // Importar Google Generative AI
//         const { GoogleGenerativeAI } = await import('@google/generative-ai');
        
//         // Inicializar Gemini con la API key desde variables de entorno
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        
//         // Usar modelo gratuito gemini-1.5-flash para image-to-image
//         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
//         // Descargar la imagen desde la URL
//         const imageResponse = await fetch(image.publicUrl);
//         if (!imageResponse.ok) {
//             throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
//         }
        
//         const imageBuffer = await imageResponse.arrayBuffer();
//         const base64Image = Buffer.from(imageBuffer).toString('base64');
        
//         // Prompt específico para transformar ecografía a ilustración artística
//         const prompt = `
//         Transform this fetal ultrasound image into a beautiful, artistic baby illustration.
//         Make it:
//         - Clear and visible baby features
//         - Soft, artistic style
//         - Warm and gentle appearance
//         - Appropriate for parents
//         - Maintain the essence but make it artistic
        
//         Return a description of the transformed image that would be suitable for creating an artistic illustration.
//         `;
        
//         // Llamar a Gemini API con la imagen y el prompt
//         const result = await model.generateContent([
//             prompt,
//             {
//                 inlineData: {
//                     data: base64Image,
//                     mimeType: 'image/jpeg'
//                 }
//             }
//         ]);
        
//         const response = await result.response;
//         const processedDescription = response.text();
        
//         console.log('Gemini processed image description:', processedDescription);
        
//         // Generar nombre único para la imagen procesada
//         const timestamp = Date.now();
//         const processedPath = `gemini_processed_${timestamp}_${image.path}`;
//         const processedPublicUrl = `/processed/${processedPath}`;
        
//         // NOTA: Gemini 1.5-flash no genera imágenes directamente
//         // Retorna descripciones textuales. Para generar imágenes reales,
//         // necesitarías usar otro servicio como DALL-E, Midjourney, o Stable Diffusion
//         // Por ahora, simulamos la URL de la imagen procesada
        
//         return {
//             path: processedPath,
//             publicUrl: processedPublicUrl,
//             fullPath: `processed_${image.fullPath}`,
//         };
        
//     } catch (error) {
//         console.error('Error processing image with Gemini:', error);
//         throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
// }

export async function createIllustration(illustrationData: IllustrationFormData): Promise<IllustrationResponse> {
    const supabase = await supabaseServer();

    const settings = await getSettings();
    if (!settings?.company) {
        throw new Error("Error to get company settings");
    }

    const images = illustrationData.images.map((image) => {
        if (image.isUploaded) {
            return image;
        }
        return {
            ...image,
            path: image.path || "",
            isUploaded: true,
        };
    });

    const mappedImages = await Promise.all(
        images.map(async (imageDetails) => {
            const { path } = imageDetails;
            if (!path) {
                throw new Error("Path is required");
            }

            const { data } = await supabase.storage
                .from(UNPROCESSED_IMAGES_BUCKET)
                .createSignedUrl(path, 60 * 60 * 24 * 365);

            if (!data) {
                throw new Error("Image not found");
            }

            return {
                path: path,
                fullPath: "",
                publicUrl: data.signedUrl,
            };
        }),
    );

    const imageData: ImageDataFormat[] = mappedImages.map(
        (image: ImageUploaded): ImageDataFormat => {
            return {
                id: Math.random().toString(36).substring(2, 15),
                isFinished: false,
                isFailed: false,
                isPending: true,
                images: {
                    unprocessed: image,
                    processed: {
                        path: "",
                        fullPath: "",
                        publicUrl: "",
                    },
                },
            };
        },
    );

    const illustrationDetail = {
        user_id: settings.user.uuid_user,
        profile_id: illustrationData.profileId,
        description: illustrationData.description || "",
        gestational_week: illustrationData.gestationalWeek || "",
        baby_name: illustrationData.name || "",
        images: imageData as unknown as Json,
        avatar_picture_url: mappedImages[0].publicUrl,
        process_status: ILLUSTRATION_STATUS.PENDING,
        model_id: null,
        company_id: settings.company.id,
        team_id: null,
    } as IllustrationInsert;

    const { data, error } = await supabase
        .from(DBTableList.ILLUSTRATIONS)
        .insert(illustrationDetail)
        .select("id")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return {
        id: data.id,
        ...illustrationDetail,
    } as IllustrationResponse;
}
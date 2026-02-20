import { NextRequest, NextResponse } from "next/server";
import { IllustrationResponse } from "@/actions/illustrations";
import { ILLUSTRATION_STATUS } from "@/models/illustration.model";
import { supabaseServer } from "@/lib/supabase/server";

const MODEL_NAME = "gemini-3-pro-image-preview";
const HEADERS_CORS = {
  "Access-Control-Allow-Origin":
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cross-Origin-Resource-Policy": "same-origin",
};

// Function to process image with Gemini API
async function processImageWithGemini(
  imageUrl: string,
  illustrationId: number,
  imageIndex: number
): Promise<{ description: string; processedImageUrl: string }> {
  try {
    const supabase = await supabaseServer();

    console.log(
      `Processing image ${imageIndex} with Gemini for illustration ${illustrationId}:`,
      imageUrl
    );

    // Import Google Generative AI
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Initialize Gemini with the API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use gemini-1.5-flash for image analysis and description
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Download the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const mimeType = "image/jpeg";

    // Prompt to transform ultrasound to artistic baby illustration
    const prompt = `Generate a photorealistic reconstruction strictly based on this 3D fetal ultrasound image.
Preserve 100% of the original anatomy, facial structure, proportions, and exact fetal pose. Do not modify position, expression, angle, or orientation in any way.
The output must look like a realistic 26-week gestational age baby, medically accurate and developmentally consistent.
Maintain natural Latino ethnic traits without exaggeration.
NON NEGOTIABLE: The baby skin tone must be like a newborn baby, baby eyes are closed always.
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
                mimeType,
              },
            },
          ],
        },
      ],
    });

    const response = result.response;
    const processedDescription = response.text();

    // Extract base64 image from the response if available
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

    // Extract usage metadata from Gemini response
    const usageMetadata = response.usageMetadata || {}

    // Store usage metadata in tbl_expense_model_history
    if (usageMetadata && Object.keys(usageMetadata).length > 0) {
      try {
        const { error: historyError } = await supabase.from('tbl_expense_model_history')
          .insert({
            json_response: usageMetadata,
            model_name: MODEL_NAME,
            illustration_id: illustrationId.toString(),
            type: 'image_generation'
          });
        
        if (historyError) {
          console.error('Error storing usage metadata:', historyError);
        } else {
          console.log('Successfully stored usage metadata in tbl_expense_model_history');
        }
      } catch (historyError) {
        console.error('Failed to insert usage metadata:', historyError);
      }
    }

    // If no image was generated, create a placeholder or use original
    if (!generatedBase64Image) {
      console.log('No generated image found in response, using original image as fallback');
      generatedBase64Image = base64Image;
    }

    // Store the processed image in Supabase bucket
    const timestamp = Date.now();
    const fileName = `illustration_${illustrationId}_image_${imageIndex}_${timestamp}.jpg`;
    
    // Convert base64 to buffer for upload
    const imageBufferForUpload = Buffer.from(generatedBase64Image, 'base64');
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('illustrations')
      .upload(fileName, imageBufferForUpload, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      throw new Error(`Failed to upload processed image: ${uploadError.message}`);
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('illustrations')
      .getPublicUrl(fileName);

    const processedImageUrl = publicUrlData.publicUrl;
    console.log(`Successfully uploaded processed image to: ${processedImageUrl}`);


    // need to update 

    return {
      description: processedDescription,
      processedImageUrl: processedImageUrl
    };

  } catch (error) {
    console.error(
      `Error processing image ${imageIndex} with Gemini:`,
      error
    );
    throw new Error(
      `Gemini API error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const body: IllustrationResponse = await req.json();
    console.log('Processing illustration:', body.id);
    
    // Update illustration status to PROCESSING
    await supabase
      .from('tbl_illustrations')
      .update({
        process_status: ILLUSTRATION_STATUS.PROCESSING,
      })
      .eq("id", body.id);
    
    console.log(`Updated illustration ${body.id} status to PROCESSING`);
    
    // Process each image in the illustration
    const images = body.images as any[];
    const processedResults = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      try {
        // Process the image with Gemini
        const processedResult = await processImageWithGemini(
          image.images.unprocessed.publicUrl,
          body.id,
          i
        );
        
        // Update the specific image with the processed result
        const updatedImages = images.map((img: any, index: number) => {
          if (index === i) {
            return {
              ...img,
              isPending: false,
              isFailed: false,
              isFinished: true,
              processedDescription: processedResult.description,
              processedImageUrl: processedResult.processedImageUrl,
              processedAt: new Date().toISOString(),
            };
          }
          return img;
        });
        
        // Update the illustration with the processed image data
        await supabase
          .from('tbl_illustrations')
          .update({
            images: updatedImages,
          })
          .eq("id", body.id);
        
        processedResults.push({
          imageIndex: i,
          status: 'success',
          description: processedResult.description,
          processedImageUrl: processedResult.processedImageUrl,
        });
        
        console.log(`Successfully processed image ${i} for illustration ${body.id}`);
        
      } catch (error) {
        console.error(`Failed to process image ${i} for illustration ${body.id}:`, error);
        
        // Mark the image as failed
        const updatedImages = images.map((img: any, index: number) => {
          if (index === i) {
            return {
              ...img,
              isPending: false,
              isFailed: true,
              error: error instanceof Error ? error.message : 'Unknown error',
              failedAt: new Date().toISOString(),
            };
          }
          return img;
        });
        
        await supabase
          .from('tbl_illustrations')
          .update({
            images: updatedImages,
          })
          .eq("id", body.id);
        
        processedResults.push({
          imageIndex: i,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    // Update illustration status to COMPLETED
    await supabase
      .from('tbl_illustrations')
      .update({
        process_status: ILLUSTRATION_STATUS.COMPLETED,
        completed_at: new Date().toISOString(),
      })
      .eq("id", body.id);
    
    console.log(`Completed processing illustration ${body.id}`);
    
    return NextResponse.json({ 
      message: 'Illustration processed successfully',
      illustrationId: body.id,
      results: processedResults,
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
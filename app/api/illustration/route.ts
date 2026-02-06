import { NextRequest, NextResponse } from "next/server";
import { IllustrationResponse } from "@/actions/illustrations";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ILLUSTRATION_STATUS } from "@/models/illustration.model";
import { supabaseServer } from "@/lib/supabase/server";

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
): Promise<string> {
  const supabase = supabaseServer();

  try {
    console.log(
      `Processing image ${imageIndex} with Gemini for illustration ${illustrationId}:`,
      imageUrl
    );

    // Import Google Generative AI SDK
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use Gemini 1.5 Flash (supports images)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image',
    });

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    const mimeType =
      imageResponse.headers.get('content-type') ?? 'image/jpeg';

    // Prompt
    const prompt = `
Analyze this fetal ultrasound image and create a detailed description for generating a beautiful, artistic baby illustration.

Describe what you see in terms of:
- Baby's position and visible features
- Facial characteristics if visible
- Overall composition
- Artistic style that would be appropriate for parents

The goal is to create a warm, gentle, artistic baby illustration that captures the essence of the ultrasound while making it more visually appealing and clear.

Provide a detailed description that could be used to generate such an artistic illustration.
    `.trim();

    // ✅ Correct multimodal Gemini request
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
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

    console.log(
      `Gemini processed image ${imageIndex} description:`,
      processedDescription
    );

    // Upload original image to Supabase storage
    await (await supabase).storage
      .from('illustrations')
      .upload(
        `illustration-${illustrationId}-${imageIndex}.jpg`,
        imageBuffer,
        {
          contentType: mimeType,
          upsert: true,
        }
      );

    // Return the generated description
    return processedDescription;
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
    const body: IllustrationResponse = await req.json();
    console.log('Processing illustration:', body.id);
    
    // Initialize Supabase client
    const supabase = supabaseBrowser();
    
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
        const processedDescription = await processImageWithGemini(
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
          description: '',
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
import { toast } from "sonner";
import { supabaseBrowser } from "./supabase/client";

export const uploadImageToBucket = async ({ image, bucketName }: { image: string, bucketName: string }) => {
    const supabase = supabaseBrowser();
    const base64WithoutPrefix = image.split("base64,")[1];
    const filePath = `public/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, Buffer.from(base64WithoutPrefix, "base64"), {
            contentType: "image/jpg",
            upsert: false,
        });

    if (error) {
        toast.error("Error uploading image to bucket");
        throw new Error("Error uploading image to bucket");
    }

    toast.success("Image uploaded to bucket");
    return data;
};

export const removeImageToBucket = async ({ path, bucketName }: { path: string, bucketName: string }) => {
    const supabase = supabaseBrowser();
    await supabase.storage.from(bucketName).remove([path]);
    toast.success("Image removed from bucket");
}
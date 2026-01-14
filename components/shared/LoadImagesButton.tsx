"use client";

import {
  removeImageToBucket,
  uploadImageToBucket,
} from "@/lib/forms.utils";
import { ImageFormat } from "@/models/illustration.model";
import { PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type Props = {
  multiple?: boolean;
  fieldId: string;
  isAsset?: boolean;
  onUpload?: (path: string | null) => void;
  onReset?: () => void;
  setValue?: any;
};

export function LoadImagesButton({
  multiple = false,
  fieldId,
  isAsset = false,
  onUpload,
  setValue,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<ImageFormat[]>([]);
  const bucketName = isAsset ? "company_assets" : "profile_assets";
  const isEmpty = images.length === 0;

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    let updated = [...images];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se permiten imágenes");
        continue;
      }

      if (file.size > 1 * 1024 * 1024) {
        toast.error("La imagen no puede superar 1MB");
        continue;
      }

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const image: ImageFormat = {
        name: file.name,
        base64,
        isUploaded: false,
      };

      updated = multiple ? [...updated, image] : [image];
      setImages(updated);

      startTransition(async () => {
        const upload = await uploadImageToBucket({
          image: base64,
          bucketName,
        });

        updated = updated.map((img) =>
          img.name === file.name
            ? { ...img, path: upload.path, isUploaded: true }
            : img
        );

        setImages(updated);
        onUpload?.(upload.path);

        const cleanedForForm = updated.map((img) => ({
          ...img,
          base64: "",
        }));

        setValue?.("images", cleanedForForm, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      });
    }
  };

  /* ===============================
     ESCUCHAR INPUT FILE
  =============================== */
  useEffect(() => {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    if (!input) return;

    const handleChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      processFiles(files);

      // permite seleccionar el mismo archivo otra vez
      input.value = "";
    };

    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, [fieldId, images]);

  /* ===============================
     CLICK / DRAG & DROP
  =============================== */
  const openFileDialog = () => {
    const input = document.getElementById(fieldId) as HTMLInputElement;
    input?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  /* ===============================
     ELIMINAR IMAGEN
  =============================== */
  const removeImage = async (path?: string | null, index?: number) => {
    if (!path) return;

    try {
      await removeImageToBucket({ path, bucketName });
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      onUpload?.(null);

      // Update form when image is removed
      const cleanedForForm = updatedImages.map((img) => ({
        ...img,
        base64: "",
      }));

      setValue?.("images", cleanedForForm, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch {
      toast.error("Error eliminando la imagen");
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <>
      {isEmpty && (
        <button
          type="button"
          onClick={openFileDialog}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full hover:opacity-75 cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition ${
            isDragging
              ? "border-primary bg-muted/50"
              : "border-muted-foreground/25"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <PlusIcon className="size-8 text-muted-foreground" />
            <p className="font-medium">
              {multiple ? "Subir imágenes" : "Subir imagen"}
            </p>
            <p className="text-sm text-muted-foreground">
              Arrastra o haz clic para seleccionar
            </p>
            {multiple && <p className="text-xs text-muted-foreground mt-2">
              Formatos: JPG, PNG, GIF, WebP • Máximo 5 imágenes • Máximo 4MB
              por imagen
            </p>}
          </div>
        </button>
      )}

      {images.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative ${
                !img.isUploaded ? "opacity-50" : ""
              }`}
            >
              <Button
                type="button"
                size="icon"
                className="absolute top-2 right-2 z-10 cursor-pointer hover:opacity-75"
                onClick={() => removeImage(img.path, index)}
              >
                <TrashIcon className="size-4" />
              </Button>

              <Image
                src={img.base64}
                alt="image"
                width={240}
                height={240}
                className={" object-cover border" + (isAsset ? " w-40 h-40 rounded-full" : " w-60 h-60  rounded-md ")}
              />
            </div>
          ))}
         {multiple && <Button
              type="button"
              variant="ghost"
              onClick={openFileDialog}
              className=" cursor-pointer w-60 h-60 rounded-md flex items-center justify-center outline-1 -outline-offset-1 outline-gray-900/20 outline-dashed dark:outline-white/20"
            >
              <PlusIcon />
            </Button>}
        </div>
      )}
    </>
  );
}
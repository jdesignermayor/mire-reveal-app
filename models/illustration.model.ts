import { Database } from "@/lib/supabase/types";

export interface ImageDataFormat {
  id: string;
  isFinished: boolean;
  isFailed: boolean;
  isPending: boolean;
  isOpened?: boolean;
  images: {
    unprocessed: ImageUploaded;
    processed: ImageUploaded;
  };
}

export interface ImageFormat {
  name: string;
  base64: string;
  path?: string;
  isUploaded: boolean;
}

export interface IllustrationImage {
  id: string;
  url: string;
  createdAt: string;
}

export interface ResponsePostIllustrationSchema {
  id: string;
}

export interface ImageUploaded {
  path: string;
  fullPath: string;
  publicUrl: string;
}

export enum ILLUSTRATION_STATUS {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
export type Illustration =
    Database['public']['Tables']['tbl_illustrations']['Row'] & { user_name: string }
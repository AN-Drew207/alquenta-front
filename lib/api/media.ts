import axios from "axios";
import { api } from "./client";

export interface UploadSignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  maxFileSize: number;
  resourceType: "image" | "video";
}

export async function getUploadSignature(
  resourceType: "image" | "video",
): Promise<UploadSignature> {
  const { data } = await api.post<UploadSignature>("/media/signature", { resourceType });
  return data;
}

const cloudinaryClient = axios.create();

export async function uploadToCloudinary(
  file: File,
  signature: UploadSignature,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("max_file_size", String(signature.maxFileSize));

  const { data } = await cloudinaryClient.post<{ secure_url: string }>(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`,
    formData,
    {
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );

  return data.secure_url;
}

import axios, { AxiosError } from "axios";

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error
  );
}

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ statusCode?: number; message?: string; error?: string }>) => {
    const data = error.response?.data;
    const apiError: ApiError = {
      statusCode: error.response?.status ?? 0,
      message: data?.message ?? error.message ?? "Unexpected error",
      error: data?.error ?? "UnknownError",
    };
    return Promise.reject(apiError);
  },
);

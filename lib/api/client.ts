import axios, { AxiosError } from "axios";
import { API_URL } from "@/lib/env";

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

const ERROR_MESSAGES_ES: Record<string, string> = {
  InvalidCredentialsException: "Correo electrónico o contraseña incorrectos.",
  AccountDeactivatedException: "Tu cuenta está desactivada.",
  AccountDisabledBySuperadminException:
    "Tu cuenta fue deshabilitada por un administrador. Contacta a soporte.",
  EmailAlreadyRegisteredException:
    "Ya existe una cuenta registrada con ese correo electrónico.",
  UsernameTakenException: "Ese nombre de usuario ya está en uso.",
  InvalidVerificationTokenException: "Este enlace no es válido o ya expiró.",
  InvalidAccountConfirmationException: "El texto de confirmación no coincide.",
  EntityNotFoundException: "No se encontró lo que buscabas.",
  PropertyNotOwnedByAdminException: "Esta propiedad no te pertenece.",
  PropertyNotCancelledException:
    "La propiedad debe estar cancelada antes de continuar.",
  InvalidPriceException: "El precio debe ser mayor a cero.",
  NotificationNotOwnedByUserException: "Esta notificación no te pertenece.",
  NotConversationParticipantException: "No formas parte de esta conversación.",
  PropertyNotAvailableException: "Esta propiedad ya no está disponible.",
  Unauthorized: "Tu sesión expiró. Inicia sesión de nuevo.",
  Forbidden: "No tienes permiso para hacer esto.",
  "Bad Request": "Revisa los datos ingresados.",
};

/**
 * Backend exception messages are always in English. This maps the small,
 * known set of domain exceptions to Spanish copy and otherwise falls back
 * to the caller's already-translated message, so raw English text never
 * reaches the user.
 */
export function translateApiError(error: unknown, fallback: string): string {
  if (isApiError(error) && ERROR_MESSAGES_ES[error.error]) {
    return ERROR_MESSAGES_ES[error.error];
  }
  return fallback;
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
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

import { api } from "./client";
import type { Plan } from "@/types/plan";

export async function fetchPlans(): Promise<Plan[]> {
  const { data } = await api.get<Plan[]>("/plans");
  return data;
}

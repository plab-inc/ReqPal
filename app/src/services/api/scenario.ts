import http from "@/services/api/api.ts";
import { DeployScenarioResponse } from "@/types/bpmn.ts";

export const deployScenario = async (scenarioId: string): Promise<DeployScenarioResponse> => {
  const response = await http.post<DeployScenarioResponse>(`scenario/deploy/${scenarioId}`);
  return response.data;
};

export const deleteScenario = async (scenarioId: string): Promise<void> => {
  await http.post(`scenario/delete/${scenarioId}`);
};
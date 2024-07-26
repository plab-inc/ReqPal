import http from "@/services/api/api.ts";
import { BpmnResponse, InvokeItemResponse, StartWorkflowResponse } from "@/types/bpmn.ts";

export const startWorkflow = async (scenarioId: string): Promise<StartWorkflowResponse> => {
  const response = await http.post<BpmnResponse>(`/process/start/${scenarioId}`);
  return response.data.description as StartWorkflowResponse;
};

export const invokeItem = async (scenarioId: string, lessonResults: any): Promise<InvokeItemResponse> => {
  const response = await http.post<BpmnResponse>(`/process/invoke/${scenarioId}`, lessonResults);
  return response.data.description as InvokeItemResponse;
};
import http from "@/services/api/api.ts";
import { InvokeItemResponse, ProcessInstanceStatus, StartWorkflowResponse } from "@/types/bpmn.ts";

export const startWorkflow = async (scenarioId: string): Promise<StartWorkflowResponse> => {
  const response = await http.post<StartWorkflowResponse>(`/process/start/${scenarioId}`);
  return response.data;
};

export const invokeItem = async (scenarioId: string, lessonResults: any): Promise<InvokeItemResponse> => {
  const response = await http.post<InvokeItemResponse>(`/process/invoke/${scenarioId}`, lessonResults);
  return response.data;
};

export const getProcessInstanceStatus = async (scenarioId: string): Promise<ProcessInstanceStatus> => {
  const response = await http.get<ProcessInstanceStatus>(`/process/status/${scenarioId}`);
  return response.data;
};
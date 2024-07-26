export interface StartWorkflowResponse {
  processInstanceId: string;
  lessonId: string;
}

export interface InvokeItemResponse {
  nextLessonId: string;
}

export interface BpmnResponse {
  status: string;
  description: StartWorkflowResponse | InvokeItemResponse;
}
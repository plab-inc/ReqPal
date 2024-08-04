export interface StartWorkflowResponse {
  processInstanceId: string;
  lessonId: string;
}

export interface InvokeItemResponse {
  nextLessonId: string;
}

export interface DeployScenarioResponse {
  deploymentName: string;
}
export interface StartWorkflowResponse {
  processInstanceId: string;
  lessonId: string;
}

export interface InvokeItemResponse {
  nextLessonId?: string;
  message?: string;
}

export interface ProcessInstanceStatus {
  scenarioId: string;
  processInstanceId: string;
  processDefinitionKey: string;
  isEnded: boolean;
  openTasks: TaskDetails[];
  processInstanceVariables: any;
}

export interface TaskDetails {
  taskId: string;
  lessonId: string;
  taskName: string;
  taskDefinitionKey: string;
  assignee: string;
}
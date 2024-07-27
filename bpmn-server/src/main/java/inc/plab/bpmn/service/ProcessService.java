package inc.plab.bpmn.service;

import inc.plab.bpmn.delegate.service.TaskDelegate;
import inc.plab.bpmn.delegate.service.WorkflowDelegate;
import inc.plab.bpmn.dto.InvokeLessonUserTaskResponseDto;
import inc.plab.bpmn.dto.WorkflowResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProcessService {

    private final WorkflowDelegate workflowDelegate;
    private final TaskDelegate taskDelegate;

    @SneakyThrows
    public WorkflowResponseDto startWorkflowForScenario(String scenarioId, String studentId) {
        return workflowDelegate.startWorkflowForScenario(scenarioId, studentId);
    }

    @SneakyThrows
    public InvokeLessonUserTaskResponseDto invokeItem(String processDefinitionKey, String studentId, String lessonResults) {
        return taskDelegate.invokeLessonUserTask(processDefinitionKey, studentId, lessonResults);
    }
}

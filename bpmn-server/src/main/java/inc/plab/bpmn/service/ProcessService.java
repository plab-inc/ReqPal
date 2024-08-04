package inc.plab.bpmn.service;

import inc.plab.bpmn.delegate.service.TaskDelegate;
import inc.plab.bpmn.delegate.service.WorkflowDelegate;
import inc.plab.bpmn.dto.InvokeLessonUserTaskResponseDto;
import inc.plab.bpmn.dto.StartWorkflowResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProcessService {

    private final WorkflowDelegate workflowDelegate;
    private final TaskDelegate taskDelegate;
    private final TaskService taskService;

    @SneakyThrows
    public StartWorkflowResponseDto startWorkflowForScenario(String scenarioId, String studentId, String teacherId) {
        return workflowDelegate.startWorkflowForScenario(scenarioId, studentId, teacherId);
    }

    @SneakyThrows
    public InvokeLessonUserTaskResponseDto invokeItem(String scenarioId, String studentId, String teacherId, String lessonResults) {
        Task nextTask = taskDelegate.invokeLessonUserTask(scenarioId, studentId, teacherId, lessonResults);

        InvokeLessonUserTaskResponseDto response = new InvokeLessonUserTaskResponseDto();

        if (nextTask == null) {
            response.setNextLessonId(null);
            return response;
        }

        String nextLessonId = (String) taskService.getVariable(nextTask.getId(), "lessonId");
        response.setNextLessonId(nextLessonId);
        return response;
    }
}

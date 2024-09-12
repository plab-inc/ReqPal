package inc.plab.bpmn.service.scenario;

import inc.plab.bpmn.dto.InvokeLessonUserTaskResponseDto;
import inc.plab.bpmn.dto.StartWorkflowResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScenarioProcessService {

    private final WorkflowService workflowService;
    private final TaskService taskService;
    private final ScenarioTaskService scenarioTaskService;

    @SneakyThrows
    public StartWorkflowResponseDto startWorkflowForScenario(String scenarioId, String studentId, String teacherId) {
        return workflowService.startWorkflowForScenario(scenarioId, studentId, teacherId);
    }

    @SneakyThrows
    public InvokeLessonUserTaskResponseDto invokeItem(String scenarioId, String studentId, String teacherId, String lessonResults) {
        Task nextTask = scenarioTaskService.invokeLessonUserTask(scenarioId, studentId, teacherId, lessonResults);

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

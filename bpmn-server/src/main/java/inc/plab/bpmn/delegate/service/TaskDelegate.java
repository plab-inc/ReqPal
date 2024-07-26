package inc.plab.bpmn.delegate.service;

import inc.plab.bpmn.dto.InvokeLessonUserTaskDescription;
import inc.plab.bpmn.dto.InvokeLessonUserTaskResponseDto;
import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.lesson.LessonRepository;
import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import inc.plab.bpmn.model.scenario.UserScenario;
import inc.plab.bpmn.model.scenario.UserScenarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.camunda.spin.json.SpinJsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

import static org.camunda.spin.Spin.JSON;

@Component
@RequiredArgsConstructor
public class TaskDelegate {

    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final UserScenarioRepository userScenarioRepository;
    private final LessonRepository lessonRepository;
    private final ScenarioRepository scenarioRepository;
    private static final Logger logger = LoggerFactory.getLogger(TaskDelegate.class);

    @SneakyThrows
    public InvokeLessonUserTaskResponseDto invokeLessonUserTask(String processDefinitionKey, String studentId, String lessonResults) {
        Scenario scenario = scenarioRepository.findById(UUID.fromString(processDefinitionKey.substring(8)))
                .orElseThrow(() -> new RuntimeException("No scenario to task found."));

        Task currentTask = fetchCurrentTask(processDefinitionKey, studentId);
        String lessonId = getLessonId(currentTask);

        SpinJsonNode lessonResultsJson = fetchLessonResultsJson(currentTask.getProcessInstanceId());
        SpinJsonNode lessonResultJson = JSON(lessonResults);

        updateLessonResults(lessonResultsJson, lessonId, lessonResultJson, currentTask.getProcessInstanceId());
        completeCurrentTask(currentTask);

        Task nextTask = fetchNextTask(processDefinitionKey, studentId);
        String newLessonId = Optional.ofNullable(nextTask)
                .map(this::getLessonId)
                .orElse(null);

        updateScenarioProgress(scenario, studentId, newLessonId);

        return createInvokeItemResponse(nextTask);
    }

    @SneakyThrows
    private void updateScenarioProgress(Scenario scenario, String studentId, String newLessonId) {
        UserScenario userScenario = userScenarioRepository.findByScenarioAndUser_Id(scenario, UUID.fromString(studentId))
                .orElseThrow(() -> new RuntimeException("No ScenarioProgress to task found."));

        userScenario.setCurrentStep(userScenario.getCurrentStep() + 1);

        if (newLessonId != null) {
            Lesson lesson = lessonRepository.findById(UUID.fromString(newLessonId))
                    .orElseThrow(() -> new RuntimeException("No Lesson to lessonId found."));
            userScenario.setCurrentLesson(lesson);
        } else {
            userScenario.setCurrentLesson(null);
            userScenario.setEnded(true);
        }

        userScenarioRepository.save(userScenario); // Save changes to the database
    }

    private Task fetchCurrentTask(String processDefinitionKey, String studentId) throws Exception {
        Task currentTask = taskService.createTaskQuery()
                .processDefinitionKey(processDefinitionKey)
                .taskAssignee(studentId)
                .singleResult();

        if (currentTask == null) {
            logger.error("Task {} for Student not found", studentId);
            throw new Exception("Task not found");
        }

        return currentTask;
    }

    private String getLessonId(Task currentTask) {
        return (String) taskService.getVariable(currentTask.getId(), "lessonId");
    }

    private SpinJsonNode fetchLessonResultsJson(String processInstanceId) {
        return Optional.ofNullable((SpinJsonNode) runtimeService.getVariable(processInstanceId, "lessonResults"))
                .orElse(JSON("[]"));
    }

    private void updateLessonResults(SpinJsonNode lessonResultsJson, String lessonId, SpinJsonNode lessonResultJson, String processInstanceId) {
        SpinJsonNode newLesson = JSON("{}");
        newLesson.prop("lessonId", lessonId);
        newLesson.prop("lessonResult", lessonResultJson);

        lessonResultsJson.append(newLesson);

        runtimeService.setVariable(processInstanceId, "lastLessonResult", lessonResultJson);
        runtimeService.setVariable(processInstanceId, "lessonResults", lessonResultsJson);
    }

    private void completeCurrentTask(Task currentTask) {
        taskService.complete(currentTask.getId());
    }

    private Task fetchNextTask(String processDefinitionKey, String studentId) {
        return taskService.createTaskQuery()
                .processDefinitionKey(processDefinitionKey)
                .taskAssignee(studentId)
                .singleResult();
    }

    private InvokeLessonUserTaskResponseDto createInvokeItemResponse(Task nextTask) {
        InvokeLessonUserTaskResponseDto response = new InvokeLessonUserTaskResponseDto();

        if (nextTask == null) {
            response.setDescription(new InvokeLessonUserTaskDescription(null));
            return response;
        }

        String nextLessonId = (String) taskService.getVariable(nextTask.getId(), "lessonId");
        response.setDescription(new InvokeLessonUserTaskDescription(nextLessonId));
        return response;
    }
}
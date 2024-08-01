package inc.plab.bpmn.delegate.service;

import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.lesson.LessonRepository;
import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioProgress;
import inc.plab.bpmn.model.scenario.ScenarioProgressRepository;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
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
    private final ScenarioProgressRepository scenarioProgressRepository;
    private final LessonRepository lessonRepository;
    private final ScenarioRepository scenarioRepository;
    private static final Logger logger = LoggerFactory.getLogger(TaskDelegate.class);

    @SneakyThrows
    public Task invokeLessonUserTask(String scenarioId, String studentId, String teacherId, String lessonResults) {
        Scenario scenario = getScenario(scenarioId, teacherId).orElseThrow(() -> new Exception("No matching scenario found."));

        if (!scenario.getDeployed()) {
            throw new Exception("Scenario is not deployed");
        }

        ScenarioProgress scenarioProgress = getScenarioProgress(scenario, studentId).orElseThrow(() -> new Exception("No progress to scenario found."));

        if (!scenarioProgress.getStarted()) {
            throw new Exception("Scenario is not started.");
        }

        String processDefinitionKey = generateProcessDefinitionKey(scenarioId);

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

        updateScenarioProgress(scenarioProgress, newLessonId);

        return nextTask;
    }

    private Optional<Scenario> getScenario(String scenarioId, String studentId) {
        return scenarioRepository.findByIdAndUser_Id(UUID.fromString(scenarioId), UUID.fromString(studentId));
    }

    private Optional<ScenarioProgress> getScenarioProgress(Scenario scenario, String studentId) {
        return scenarioProgressRepository.findByScenarioAndUser_Id(scenario, UUID.fromString(studentId));
    }

    private String generateProcessDefinitionKey(String scenarioId) {
        return "Process_" + scenarioId;
    }

    @SneakyThrows
    private void updateScenarioProgress(ScenarioProgress scenarioProgress, String newLessonId) {

        scenarioProgress.increaseStep();

        if (newLessonId != null) {
            Lesson lesson = lessonRepository.findById(UUID.fromString(newLessonId))
                    .orElseThrow(() -> new RuntimeException("No Lesson to lessonId found."));
            scenarioProgress.setCurrentLesson(lesson);
        }

        if (newLessonId == null) {
            scenarioProgress.setCurrentLesson(null);
            scenarioProgress.setEnded(true);
        }

        scenarioProgressRepository.save(scenarioProgress);
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
}
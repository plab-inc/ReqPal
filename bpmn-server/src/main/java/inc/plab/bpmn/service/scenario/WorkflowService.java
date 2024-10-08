package inc.plab.bpmn.service.scenario;

import inc.plab.bpmn.dto.StartWorkflowResponseDto;
import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.lesson.LessonRepository;
import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioProgress;
import inc.plab.bpmn.model.scenario.ScenarioProgressRepository;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

import static org.camunda.spin.Spin.JSON;

@Component
@RequiredArgsConstructor
public class WorkflowService {

    private final RuntimeService runtimeService;
    private final RepositoryService repositoryService;
    private static final Logger logger = LoggerFactory.getLogger(WorkflowService.class);
    private final TaskService taskService;
    private final ScenarioRepository scenarioRepository;
    private final ScenarioProgressRepository scenarioProgressRepository;
    private final LessonRepository lessonRepository;

    public StartWorkflowResponseDto startWorkflowForScenario(String scenarioId, String studentId, String teacherId) throws Exception {

        Scenario scenario = getScenario(scenarioId, teacherId).orElseThrow(() -> new Exception("No matching scenario found."));

        if (!scenario.getDeployed() || scenario.getLocked()) {
            throw new Exception("Scenario is locked or not deployed");
        }

        ScenarioProgress scenarioProgress = getScenarioProgress(scenario, studentId).orElseThrow(() -> new Exception("No progress to scenario found."));

        if (scenarioProgress.getStarted()) {
            throw new Exception("Scenario already started.");
        }

        ProcessInstance processInstance = startWorkflow(scenario, studentId);

        Lesson currentLesson = lessonRepository.findById(UUID.fromString(Objects.requireNonNull(getCurrentLessonId(processInstance.getId(), studentId))))
                .orElseThrow(() -> new Exception("Current lesson not found."));

        updateScenarioProgress(scenarioProgress, currentLesson);

        StartWorkflowResponseDto startWorkflowResponseDto = new StartWorkflowResponseDto();
        startWorkflowResponseDto.setLessonId(currentLesson.getId().toString());
        startWorkflowResponseDto.setProcessInstanceId(processInstance.getId());

        return startWorkflowResponseDto;
    }

    public ProcessInstance startWorkflow(Scenario scenario, String studentId) throws Exception {

        String processDefinitionKey = generateProcessDefinitionKey(String.valueOf(scenario.getId()));
        checkForExistingInstance(processDefinitionKey, studentId);

        ProcessDefinition processDefinition = fetchProcessDefinition(processDefinitionKey);
        validateProcessDefinition(processDefinition, processDefinitionKey);

        Map<String, Object> variables = initializeVariables(studentId, String.valueOf(scenario.getId()));

        return runtimeService.startProcessInstanceById(processDefinition.getId(), variables);
    }

    private void updateScenarioProgress(ScenarioProgress scenarioProgress, Lesson currentLesson) {
        scenarioProgress.setStarted(true);
        scenarioProgress.setStartedVersion(scenarioProgress.getScenario().getVersion());
        scenarioProgress.setCurrentLesson(currentLesson);
        scenarioProgress.increaseStep();
        scenarioProgressRepository.save(scenarioProgress);
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

    private void checkForExistingInstance(String processDefinitionKey, String studentId) throws Exception {
        ProcessInstance existingInstance = runtimeService.createProcessInstanceQuery()
                .processDefinitionKey(processDefinitionKey)
                .variableValueEquals("studentId", studentId)
                .singleResult();

        if (existingInstance != null) {
            logger.error("Scenario is already running for studentId: {}", studentId);
            throw new Exception("Scenario is already running for studentId: " + studentId);
        }
    }

    private ProcessDefinition fetchProcessDefinition(String processDefinitionKey) {
        return repositoryService.createProcessDefinitionQuery()
                .processDefinitionKey(processDefinitionKey)
                .latestVersion()
                .singleResult();
    }

    private void validateProcessDefinition(ProcessDefinition processDefinition, String processDefinitionKey) throws Exception {
        if (processDefinition == null) {
            logger.error("No process definition found with key {}", processDefinitionKey);
            throw new Exception("No process definition found with key: " + processDefinitionKey);
        }
    }

    private Map<String, Object> initializeVariables(String studentId, String scenarioId) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("studentId", studentId);
        variables.put("totalPoints", 0);
        variables.put("gainedAchievements", JSON("[]"));
        variables.put("scenarioId", scenarioId);
        return variables;
    }

    private String getCurrentLessonId(String processInstanceId, String studentId) {
        Task currentTask = taskService.createTaskQuery()
                .processInstanceId(processInstanceId)
                .taskAssignee(studentId)
                .singleResult();

        if (currentTask == null) {
            return null;
        }

        return (String) taskService.getVariable(currentTask.getId(), "lessonId");
    }
}

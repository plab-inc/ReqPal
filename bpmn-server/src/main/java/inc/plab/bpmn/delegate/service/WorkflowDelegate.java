package inc.plab.bpmn.delegate.service;

import inc.plab.bpmn.dto.WorkflowDescription;
import inc.plab.bpmn.dto.WorkflowResponseDto;
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

import java.util.HashMap;
import java.util.Map;

import static org.camunda.spin.Spin.JSON;

@Component
@RequiredArgsConstructor
public class WorkflowDelegate {

    private final RuntimeService runtimeService;
    private final RepositoryService repositoryService;
    private static final Logger logger = LoggerFactory.getLogger(WorkflowDelegate.class);
    private final TaskService taskService;

    public WorkflowResponseDto startWorkflowForScenario(String scenarioId, String studentId) throws Exception {
        String processDefinitionKey = generateProcessDefinitionKey(scenarioId);

        ProcessInstance processInstance = startWorkflow(processDefinitionKey, studentId);
        WorkflowDescription description = new WorkflowDescription(processInstance.getId(), getCurrentLessonId(processInstance.getId(), studentId));

        WorkflowResponseDto response = new WorkflowResponseDto();
        response.setDescription(description);
        return response;
    }

    public ProcessInstance startWorkflow(String processDefinitionKey, String studentId) throws Exception {
        validateStudentId(studentId);
        checkForExistingInstance(processDefinitionKey, studentId);

        ProcessDefinition processDefinition = fetchProcessDefinition(processDefinitionKey);
        validateProcessDefinition(processDefinition, processDefinitionKey);

        Map<String, Object> variables = initializeVariables(studentId);

        return runtimeService.startProcessInstanceById(processDefinition.getId(), variables);
    }

    private String generateProcessDefinitionKey(String scenarioId) {
        return "Process_" + scenarioId;
    }

    private void validateStudentId(String studentId) throws Exception {
        if (studentId == null || studentId.isEmpty()) {
            throw new Exception("Student ID cannot be null or empty");
        }
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

    private Map<String, Object> initializeVariables(String studentId) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("studentId", studentId);
        variables.put("totalPoints", 0);
        variables.put("gainedAchievements", JSON("[]"));
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

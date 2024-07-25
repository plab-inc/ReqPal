package inc.plab.bpmn.service;

import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.spin.Spin;
import org.camunda.spin.json.SpinJsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.camunda.spin.Spin.JSON;

@Service
public class ProcessService {

    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final RepositoryService repositoryService;
    private static final Logger logger = LoggerFactory.getLogger(ProcessService.class);

    public ProcessService(RuntimeService runtimeService, TaskService taskService, RepositoryService repositoryService) {
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.repositoryService = repositoryService;
    }

    public ProcessInstance startWorkflow(String processDefinitionKey, String studentId) throws Exception {
        ProcessInstance existingInstance = runtimeService.createProcessInstanceQuery()
                .processDefinitionKey(processDefinitionKey)
                .variableValueEquals("studentId", studentId)
                .singleResult();

        if (existingInstance != null) {
            logger.error("Scenario is already running for studentId: {}", studentId);
            throw new Exception("Scenario is already running for studentId: " + studentId);
        }

        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                .processDefinitionKey(processDefinitionKey)
                .latestVersion()
                .singleResult();

        if (processDefinition == null) {
            logger.error("No process definition found with key {}", processDefinitionKey);
            throw new Exception("No process definition found with key: " + processDefinitionKey);
        }

        Map<String, Object> variables = new HashMap<>();
        variables.put("studentId", studentId);
        variables.put("totalPoints", 0);
        variables.put("gainedAchievements", JSON("[]"));

        return runtimeService.startProcessInstanceById(processDefinition.getId(), variables);
    }

    public String invokeItem(String processDefinitionKey, String studentId, String lessonResults) throws Exception {
        Task currentTask = taskService.createTaskQuery()
                .processDefinitionKey(processDefinitionKey)
                .taskAssignee(studentId)
                .singleResult();

        if (currentTask == null) {
            logger.error("Task {} for Student not found", studentId);
            throw new Exception("Task not found");
        }

        String lessonId = (String) taskService.getVariable(currentTask.getId(), "lessonId");
        if (lessonId == null) {
            logger.error("UserTask {} without lessonId", currentTask.getId());
            throw new Exception("No lessonId in task found: " + currentTask.getId());
        }

        SpinJsonNode lessonResultsJson = (SpinJsonNode) runtimeService.getVariable(currentTask.getProcessInstanceId(), "lessonResults");
        SpinJsonNode lessonResultJson = JSON(lessonResults);

        if (lessonResultsJson == null) {
            lessonResultsJson = JSON("[]");
        }

        SpinJsonNode newLesson = JSON("{}");
        newLesson.prop("lessonId", lessonId);
        newLesson.prop("lessonResult", lessonResultJson);

        lessonResultsJson.append(newLesson);

        runtimeService.setVariable(currentTask.getProcessInstanceId(), "lastLessonResult", lessonResultJson);
        runtimeService.setVariable(currentTask.getProcessInstanceId(), "lessonResults", lessonResultsJson);

        taskService.complete(currentTask.getId());

        Task nextTask = taskService.createTaskQuery()
                .processDefinitionKey(processDefinitionKey)
                .taskAssignee(studentId)
                .singleResult();

        if (nextTask == null) {
            return null;
        }

        return (String) taskService.getVariable(nextTask.getId(), "lessonId");
    }

    public String getProcessInstanceStatus(String processDefinitionKey, String studentId) throws Exception {
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processDefinitionKey(processDefinitionKey)
                .variableValueEquals("studentId", studentId)
                .singleResult();

        if (processInstance == null) {
            logger.error("Process instance for processDefinitionKey {} with student {} no found", processDefinitionKey, studentId);
            throw new Exception("Process instance not found.");
        }

        String processInstanceId = processInstance.getId();

        List<Task> tasks = taskService.createTaskQuery()
                .processInstanceId(processInstanceId)
                .taskAssignee(studentId)
                .active()
                .list();

        if (tasks.isEmpty()) {
            logger.error("Process instance {} contains no open tasks for student {}", processInstanceId, studentId);
            throw new Exception("No tasks found for process instance: " + processInstanceId + " and studentId: " + studentId);
        }

        SpinJsonNode taskDetails = Spin.JSON("[]");

        for (Task task : tasks) {
            SpinJsonNode taskDetail = Spin.JSON("{}");

            taskDetail.prop("taskId", task.getId());
            taskDetail.prop("lessonId", taskService.getVariable(task.getId(), "lessonId").toString());
            taskDetail.prop("taskName", task.getName());
            taskDetail.prop("taskDefinitionKey", task.getTaskDefinitionKey());
            taskDetail.prop("assignee", task.getAssignee());

            taskDetails.append(taskDetail);
        }

        SpinJsonNode processInstanceVariablesJson = Spin.JSON("{}");
        VariableMap processInstanceVariables = runtimeService.getVariablesTyped(processInstanceId);

        processInstanceVariables.forEach((key, value) -> {
            if (value instanceof SpinJsonNode) {
                processInstanceVariablesJson.prop(key, (SpinJsonNode) value);
            } else {
                processInstanceVariablesJson.prop(key, value.toString());
            }
        });

        SpinJsonNode responseJson = Spin.JSON("{}");

        responseJson.prop("scenarioId", processDefinitionKey.substring(8));
        responseJson.prop("processInstanceId", processInstanceId);
        responseJson.prop("processDefinitionKey", processDefinitionKey);
        responseJson.prop("isEnded", processInstance.isEnded());
        responseJson.prop("openTasks", taskDetails);
        responseJson.prop("processInstanceVariables", processInstanceVariablesJson);

        return responseJson.toString();
    }

    public String getCurrentLessonId(String processInstanceId, String studentId) {
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
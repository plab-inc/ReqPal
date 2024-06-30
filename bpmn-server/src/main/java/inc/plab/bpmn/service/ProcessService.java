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
        List<ProcessDefinition> processDefinitions = repositoryService.createProcessDefinitionQuery()
                .processDefinitionKey(processDefinitionKey)
                .latestVersion()
                .list();

        if (processDefinitions.isEmpty()) {
            logger.error("No process definition found with key {}", processDefinitionKey);
            throw new Exception("No process definition found with key: " + processDefinitionKey);
        }

        ProcessDefinition processDefinition = processDefinitions.get(0);
        Map<String, Object> variables = new HashMap<>();
        variables.put("studentId", studentId);
        variables.put("totalPoints", 0);

        return runtimeService.startProcessInstanceById(processDefinition.getId(), variables);
    }

    public void invokeItem(String taskId, String studentId, String lessonResults) throws Exception {
        Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
        if (task == null) {
            logger.error("Task {} for Student {} not found", taskId, studentId);
            throw new Exception("Task not found: " + taskId);
        }

        if (!studentId.equals(task.getAssignee())) {
            logger.error("Task {} not assigned to Student {}", taskId, studentId);
            throw new Exception("Forbidden: Task is not assigned to this studentId: " + studentId);
        }

        String lessonId = (String) taskService.getVariable(task.getId(), "lessonId");
        if (lessonId == null) {
            logger.error("UserTask {} without lessonId", taskId);
            throw new Exception("No lessonId in task found: " + taskId);
        }

        SpinJsonNode lessonResultsJson = (SpinJsonNode) runtimeService.getVariable(task.getProcessInstanceId(), "lessonResults");
        SpinJsonNode lessonResultJson = JSON(lessonResults);

        if (lessonResultsJson == null) {
            lessonResultsJson = JSON("[]");
        }

        SpinJsonNode newLesson = JSON("{}");
        newLesson.prop("lessonId", lessonId);
        newLesson.prop("lessonResult", lessonResultJson);

        lessonResultsJson.append(newLesson);

        runtimeService.setVariable(task.getProcessInstanceId(), "lastLessonResult", lessonResultJson);
        runtimeService.setVariable(task.getProcessInstanceId(), "lessonResults", lessonResultsJson);
        taskService.complete(task.getId());
    }


    public String getProcessInstanceStatus(String processInstanceId, String studentId) throws Exception {
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();

        if (processInstance == null) {
            logger.error("Process instance {} for student {} no found", processInstanceId, studentId);
            throw new Exception("Process instance not found: " + processInstanceId);
        }

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

        responseJson.prop("processInstanceId", processInstanceId);
        responseJson.prop("processDefinitionId", processInstance.getProcessDefinitionId());
        responseJson.prop("isEnded", processInstance.isEnded());
        responseJson.prop("tasks", taskDetails);
        responseJson.prop("processInstanceVariables", processInstanceVariablesJson);

        return responseJson.toString();
    }

}

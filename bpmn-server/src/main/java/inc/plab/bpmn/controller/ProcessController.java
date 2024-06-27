package inc.plab.bpmn.controller;

import inc.plab.bpmn.model.BpmnDiagramRepository;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.camunda.spin.Spin.JSON;

@RestController
@RequestMapping("/bpmn/process")
public class ProcessController {

    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final RepositoryService repositoryService;

    public ProcessController(RuntimeService runtimeService, TaskService taskService, RepositoryService repositoryService, BpmnDiagramRepository bpmnDiagramRepository) {
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.repositoryService = repositoryService;
    }

    @PostMapping("/start/{processDefinitionKey}")
    public ResponseEntity<String> startWorkflow(
            @PathVariable("processDefinitionKey") String processDefinitionKey,
            @RequestHeader("studentId") String studentId) {
        List<ProcessDefinition> processDefinitions = repositoryService.createProcessDefinitionQuery()
                .processDefinitionKey(processDefinitionKey)
                .latestVersion()
                .list();

        if (processDefinitions.isEmpty()) {
            return ResponseEntity.status(404).body("No process definition found with key: " + processDefinitionKey);
        }

        ProcessDefinition processDefinition = processDefinitions.get(0);
        ProcessInstance processInstance;
        try {
            Map<String, Object> variables = new HashMap<>();
            variables.put("studentId", studentId);
            variables.put("totalPoints", 0);
            processInstance = runtimeService.startProcessInstanceById(processDefinition.getId(), variables);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to start workflow: " + e.getMessage());
        }

        return ResponseEntity.ok("ProcessInstance started with processInstanceId: " + processInstance.getId());
    }

    @PostMapping("/invoke/{taskId}")
    public ResponseEntity<String> invokeItem(
            @PathVariable("taskId") String taskId,
            @RequestHeader("studentId") String studentId,
            @RequestBody String lessonSolution) {

        Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
        if (task == null) {
            return ResponseEntity.status(404).body("Task not found: " + taskId);
        }

        if (!studentId.equals(task.getAssignee())) {
            return ResponseEntity.status(403).body("Forbidden: Task is not assigned to this studentId: " + studentId);
        }

        try {
            String lessonId = (String) taskService.getVariable(task.getId(), "lessonId");
            SpinJsonNode lessonSolutionsJson = (SpinJsonNode) runtimeService.getVariable(task.getProcessInstanceId(), "lessonSolutions");
            SpinJsonNode lessonSolutionJson = JSON(lessonSolution);

            if (lessonSolutionsJson == null) {
                lessonSolutionsJson = JSON("{}");
            }

            lessonSolutionsJson.prop(lessonId, lessonSolutionJson);

            runtimeService.setVariable(task.getProcessInstanceId(), "lessonSolutions", lessonSolutionsJson);
            taskService.complete(task.getId());

            return ResponseEntity.ok("Task completed: " + taskId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error completing task: " + e.getMessage());
        }
    }


    @GetMapping("/status/{processInstanceId}")
    public ResponseEntity<?> getProcessInstanceStatus(
            @PathVariable("processInstanceId") String processInstanceId,
            @RequestHeader("studentId") String studentId) {
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();

        if (processInstance == null) {
            return ResponseEntity.status(404).body("Process instance not found: " + processInstanceId);
        }

        List<Task> tasks = taskService.createTaskQuery()
                .processInstanceId(processInstanceId)
                .taskAssignee(studentId)
                .active()
                .list();

        if (tasks.isEmpty()) {
            return ResponseEntity.status(404).body("No tasks found for process instance: " + processInstanceId + " and studentId: " + studentId);
        }

        List<Map<String, Object>> taskDetails = new ArrayList<>();
        for (Task task : tasks) {
            Map<String, Object> taskDetail = new HashMap<>();
            taskDetail.put("taskId", task.getId());
            taskDetail.put("taskName", task.getName());
            taskDetail.put("taskDefinitionKey", task.getTaskDefinitionKey());
            taskDetail.put("assignee", task.getAssignee());
            taskDetails.add(taskDetail);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("processInstanceId", processInstanceId);
        response.put("processDefinitionId", processInstance.getProcessDefinitionId());
        response.put("isEnded", processInstance.isEnded());
        response.put("tasks", taskDetails);

        return ResponseEntity.ok(response);
    }
}

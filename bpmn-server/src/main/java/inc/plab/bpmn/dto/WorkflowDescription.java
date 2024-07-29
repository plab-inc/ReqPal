package inc.plab.bpmn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WorkflowDescription {
    private String processInstanceId;
    private String lessonId;
}
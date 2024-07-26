package inc.plab.bpmn.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class WorkflowResponseDto implements BpmnResponseDto<WorkflowDescription> {
    private String status;
    private WorkflowDescription description;
}
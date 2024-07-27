package inc.plab.bpmn.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class InvokeLessonUserTaskResponseDto implements BpmnResponseDto<InvokeLessonUserTaskDescription> {
    private String status;
    private InvokeLessonUserTaskDescription description;
}
package inc.plab.bpmn.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class StartWorkflowResponseDto {
    private String processInstanceId;
    private String lessonId;
}
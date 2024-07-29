package inc.plab.bpmn.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class ExceptionResponseDto<T> implements BpmnResponseDto<T> {
    private String status;
    private T description;
}
package inc.plab.bpmn.dto;

public interface BpmnResponseDto<T> {
    void setStatus(String status);

    void setDescription(T description);
}
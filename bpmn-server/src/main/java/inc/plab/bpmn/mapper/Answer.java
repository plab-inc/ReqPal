package inc.plab.bpmn.mapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Answer {
    private String questionId;
    private Object options;
    private String type;
}

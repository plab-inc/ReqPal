package inc.plab.bpmn.model.evaluation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Answer {
    private String questionId;
    private Object options;
    private String type;
}

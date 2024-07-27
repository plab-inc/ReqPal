package inc.plab.bpmn.model.evaluation.result;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class Result {
    private String questionId;
    private int score;

}

package inc.plab.bpmn.model.question.evaluation.result;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class Result {
    private String questionId;
    private String type;
    private double score;

    public Result(String questionId, String type, double score) {

    }

    public Result() {

    }
}

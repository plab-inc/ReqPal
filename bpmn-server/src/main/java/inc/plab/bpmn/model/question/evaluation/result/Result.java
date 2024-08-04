package inc.plab.bpmn.model.question.evaluation.result;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public abstract class Result {
    private String questionId;
    private String type;
    private double score;

    public Result(String questionId, String type, double score) {
        this.questionId = questionId;
        this.type = type;
        this.score = score;
    }

    public void addPointsToScore(double points) {
        score += points;
    }
}

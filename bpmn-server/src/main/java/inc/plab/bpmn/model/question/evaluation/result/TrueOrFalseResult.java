package inc.plab.bpmn.model.question.evaluation.result;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TrueOrFalseResult extends Result {
    private boolean isCorrect;
    private boolean input;

    public TrueOrFalseResult(String questionId, String questionType, double score) {
        super(questionId, questionType, score);
    }
}

package inc.plab.bpmn.model.question.evaluation.result;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SliderResult extends Result {
    private int input;
    private boolean isCorrect;

    public SliderResult(String questionId, String questionType, double score) {
        super(questionId, questionType, score);
    }
}

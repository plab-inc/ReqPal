package inc.plab.bpmn.model.question.evaluation.result;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class SliderResult extends Result {
    private int input;
    private int maxValue;
    private int minValue;
    private int steps;
    private boolean isCorrect;

    public SliderResult(String questionId, String questionType, double score) {
        super(questionId, questionType, score);
    }
}

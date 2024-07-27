package inc.plab.bpmn.model.evaluation.result;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SliderResult extends Result {
    private int input;
    private int maxValue;
    private int minValue;
    private int steps;
    private boolean isCorrect;
}

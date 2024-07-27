package inc.plab.bpmn.model.question.solution;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SliderSolution extends Solution {
    private int correctValue;
    private int toleranceValue;
}

package inc.plab.bpmn.model.question.solution;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SliderSolution extends Solution {
    private int correctValue;
    private int toleranceValue;
}

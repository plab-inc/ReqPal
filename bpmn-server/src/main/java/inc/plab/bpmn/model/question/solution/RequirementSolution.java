package inc.plab.bpmn.model.question.solution;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequirementSolution extends Solution {
    private int toleranceValue;
}

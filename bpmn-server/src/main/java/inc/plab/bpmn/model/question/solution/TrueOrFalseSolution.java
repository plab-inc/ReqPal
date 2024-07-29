package inc.plab.bpmn.model.question.solution;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TrueOrFalseSolution extends Solution {
    private boolean value;
}

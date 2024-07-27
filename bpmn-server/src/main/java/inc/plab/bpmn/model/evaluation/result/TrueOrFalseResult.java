package inc.plab.bpmn.model.evaluation.result;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrueOrFalseResult extends Result {
    private boolean isCorrect;
    private boolean input;
}

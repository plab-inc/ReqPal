package inc.plab.bpmn.model.evaluation.result;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MultipleChoiceResult {
    private int id;
    private String description;
    private boolean input;
    private boolean isCorrect;
}

package inc.plab.bpmn.model.question.evaluation.result;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MultipleChoiceResult {
    private int id;
    private String description;
    private boolean input;
    private boolean isCorrect;
}

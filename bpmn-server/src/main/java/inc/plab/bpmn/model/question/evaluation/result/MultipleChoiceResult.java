package inc.plab.bpmn.model.question.evaluation.result;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MultipleChoiceResult {
    private int id;
    private boolean input;
    private boolean isCorrect;
}

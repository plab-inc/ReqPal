package inc.plab.bpmn.model.question.evaluation.result;

import inc.plab.bpmn.model.question.option.ProductOptions;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductResult extends ProductOptions {
    private boolean isCorrect;
}

package inc.plab.bpmn.model.question.evaluation.result;

import inc.plab.bpmn.model.question.option.Product;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResult extends Product {
    private boolean isCorrect;
}

package inc.plab.bpmn.model.evaluation.options;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SliderOptions {
    private int input;
    private int maxValue;
    private int minValue;
    private int steps;
}


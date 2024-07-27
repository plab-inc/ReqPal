package inc.plab.bpmn.model.question.option;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SliderOptions extends Option {
    private int input;
    private int maxValue;
    private int minValue;
    private int steps;
}


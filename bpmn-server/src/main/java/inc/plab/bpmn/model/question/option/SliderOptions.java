package inc.plab.bpmn.model.question.option;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SliderOptions extends Option {
    private int input;
    private int maxValue;
    private int minValue;
    private int steps;
}


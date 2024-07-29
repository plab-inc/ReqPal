package inc.plab.bpmn.model.question.option;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TrueOrFalseOptions extends Option {
    private boolean input;
}

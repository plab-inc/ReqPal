package inc.plab.bpmn.model.question.option;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MultipleChoiceOption {
    private int id;
    private String description;
    private boolean input;
}

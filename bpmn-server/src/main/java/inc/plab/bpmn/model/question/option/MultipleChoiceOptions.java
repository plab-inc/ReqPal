package inc.plab.bpmn.model.question.option;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MultipleChoiceOptions extends Option {
    private List<MultipleChoiceOption> answers = new ArrayList<>();
}


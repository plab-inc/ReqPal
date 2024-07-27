package inc.plab.bpmn.model.evaluation.result;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MultipleChoiceResults extends Result {
    private List<MultipleChoiceResult> results = new ArrayList<>();
}

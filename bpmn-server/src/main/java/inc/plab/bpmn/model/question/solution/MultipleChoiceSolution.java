package inc.plab.bpmn.model.question.solution;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MultipleChoiceSolution extends Solution{
    private List<MultipleChoiceAnswerSolution> answers;
}

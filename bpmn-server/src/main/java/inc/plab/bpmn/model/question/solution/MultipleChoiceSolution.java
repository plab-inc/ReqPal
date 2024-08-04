package inc.plab.bpmn.model.question.solution;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MultipleChoiceSolution extends Solution{
    private List<MultipleChoiceAnswerSolution> answers = new ArrayList<>();
}

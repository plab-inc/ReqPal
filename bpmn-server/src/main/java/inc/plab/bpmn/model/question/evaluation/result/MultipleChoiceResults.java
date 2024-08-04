package inc.plab.bpmn.model.question.evaluation.result;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MultipleChoiceResults extends Result {
    private List<MultipleChoiceResult> results = new ArrayList<>();

    public MultipleChoiceResults(String questionId, String questionType, double score) {
        super(questionId, questionType, score);
    }
}

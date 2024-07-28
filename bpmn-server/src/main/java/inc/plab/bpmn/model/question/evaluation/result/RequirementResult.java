package inc.plab.bpmn.model.question.evaluation.result;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class RequirementResult extends Result {

    private String requirementId;
    private List<ProductResult> productResults = new ArrayList<>();

    public RequirementResult(String questionId, String questionType, double score) {
        super(questionId, questionType, score);
    }
}

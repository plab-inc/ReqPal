package inc.plab.bpmn.model.question.evaluation.result;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequirementResult extends Result {
    private String catalogId;
    private List<String> productIds;
    private String requirementId;
    private boolean askForQualification;
    private List<ProductResult> productResults;

    public RequirementResult(String questionId, String questionType, double score) {
        super(questionId, questionType, score);
    }
}

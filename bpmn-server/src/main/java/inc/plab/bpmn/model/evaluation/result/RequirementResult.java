package inc.plab.bpmn.model.evaluation.result;

import inc.plab.bpmn.model.question.option.RequirementOptions;
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
    private List<RequirementOptions.Product> results;

    @Getter
    @Setter
    public static class Product {
        private String id;
        private int input;
        private boolean isCorrect;
    }
}

package inc.plab.bpmn.model.question.option;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequirementOptions extends Option {
    private String catalogId;
    private List<String> productIds;
    private String requirementId;
    private boolean askForQualification;
    private List<Product> products;

    @Getter
    @Setter
    public static class Product {
        private String id;
        private int input;
    }
}

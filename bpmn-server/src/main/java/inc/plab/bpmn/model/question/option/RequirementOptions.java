package inc.plab.bpmn.model.question.option;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RequirementOptions extends Option {
    private String catalogId;
    private List<String> productIds = new ArrayList<>();
    private String requirementId;
    private boolean askForQualification;
    private List<ProductOptions> products = new ArrayList<>();
}

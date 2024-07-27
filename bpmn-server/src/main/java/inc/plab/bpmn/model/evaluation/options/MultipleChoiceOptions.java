package inc.plab.bpmn.model.evaluation.options;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MultipleChoiceOptions {
    private List<Option> answers = new ArrayList<>();

    @Getter
    @Setter
    public static class Option {
        private int id;
        private String description;
        private boolean input;
    }
}


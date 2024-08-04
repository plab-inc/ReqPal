package inc.plab.bpmn.model.lesson;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionAnswer {
    private String questionId;
    private Object options;
    private String type;
}

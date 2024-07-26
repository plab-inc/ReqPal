package inc.plab.bpmn.model.evaluation;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class LessonResult {
    private List<Answer> answers;
    private int score = 0;
}

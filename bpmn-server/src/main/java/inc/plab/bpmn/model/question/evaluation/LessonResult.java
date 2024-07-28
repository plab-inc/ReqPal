package inc.plab.bpmn.model.question.evaluation;

import inc.plab.bpmn.model.question.evaluation.result.Result;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class LessonResult {
    private List<Result> results = new ArrayList<>();
    private double totalScore = 0;
    private String lessonId;

    public void addPointsToTotalScore(double points) {
        totalScore += points;
    }
}

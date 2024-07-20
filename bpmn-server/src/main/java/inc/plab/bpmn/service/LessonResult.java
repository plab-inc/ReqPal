package inc.plab.bpmn.service;

import lombok.Getter;
import lombok.Setter;
import org.camunda.spin.json.SpinJsonNode;

import java.util.UUID;

@Setter
@Getter
public class LessonResult {

    private UUID questionId;

    private SpinJsonNode results;

    private int score;

}

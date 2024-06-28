package inc.plab.bpmn.service;

import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class LessonService {

    public int evaluateLesson(String lessonId, SpinJsonNode lessonResult) {
        Random random = new Random();
        return random.nextInt(101);

    }

}

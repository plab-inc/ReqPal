package inc.plab.bpmn.service;

import inc.plab.bpmn.model.lesson.LessonRepository;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public int evaluateLesson(String lessonId, SpinJsonNode lessonResult) {
        Random random = new Random();
        return random.nextInt(101);
    }

}

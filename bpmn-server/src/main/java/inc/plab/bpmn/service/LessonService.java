package inc.plab.bpmn.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import inc.plab.bpmn.model.lesson.LessonRepository;
import inc.plab.bpmn.model.question.Question;
import inc.plab.bpmn.model.question.QuestionRepository;
import lombok.AllArgsConstructor;
import org.camunda.spin.SpinList;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private QuestionRepository questionRepository;

    public int evaluateLesson(String lessonId, SpinJsonNode lessonResult) {
/*
interface RequestBodyLesson {
    uuid: string,
    answers: LessonAnswer[],
    used_hints: number
}

interface LessonAnswer {
    uuid: string,
    question: string,
    options: string,
    type: string
}
 */
        int totalPoints = 0;
        List<LessonResult> results = new LinkedList<LessonResult>();

        if (lessonResult.hasProp("answers")) {
            SpinList<SpinJsonNode> answers = lessonResult.prop("answers").elements();
            for (SpinJsonNode answer : answers) {
                String type = String.valueOf(answer.prop("type"));
                LessonResult res = evaluateQuestionType(type, answer);
                if (res != null) {
                    results.add(res);
                    totalPoints += res.getScore();
                }
            }
        }

        System.out.println(results);

        return totalPoints;
    }

    private LessonResult evaluateQuestionType(String type, SpinJsonNode answer) {
        String lowerCaseType = type.toLowerCase();
        return switch (lowerCaseType) {
            case ("trueorfalse") -> evaluateTrueOrFalse(answer);
            case ("multiplechoice") -> evaluateMultipleChoice(answer);
            case ("slider") -> evaluateSlider(answer);
            case ("qualification") -> evaluateProductQualification(answer);
            default -> null;
        };
    }

    private LessonResult evaluateProductQualification(SpinJsonNode answer) {
        return null;
    }

    private LessonResult evaluateSlider(SpinJsonNode answer) {
        return null;
    }

    private LessonResult evaluateMultipleChoice(SpinJsonNode answer) {
        return null;
    }

    private LessonResult evaluateTrueOrFalse(SpinJsonNode answer) {
        // get question by id
        String questionId = answer.prop("questionId").stringValue();
        UUID questionUUID = UUID.fromString(questionId);
        Optional<Question> questionOptional = questionRepository.findById(questionUUID);
        if(questionOptional.isPresent()) {
            Question question = questionOptional.get();
            // compare solution and answer
            Map<String, Object> solution = question.getSolution();
            Object solutionData = solution.get("solution");
        //    ObjectMapper objectMapper = new ObjectMapper();
        //    String jsonValue = objectMapper.writeValueAsString(solutionData);
        //    System.out.println(jsonValue);
        }
        // save result in LessonResult
        // save score in LessonResult
        return null;
    }

}

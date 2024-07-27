package inc.plab.bpmn.service;

import inc.plab.bpmn.model.evaluation.Answer;
import inc.plab.bpmn.model.evaluation.AnswerResult;
import inc.plab.bpmn.jsonValidation.JsonValidator;
import inc.plab.bpmn.model.evaluation.LessonResult;
import inc.plab.bpmn.model.lesson.LessonRepository;
import inc.plab.bpmn.model.question.Question;
import inc.plab.bpmn.model.question.QuestionRepository;
import lombok.AllArgsConstructor;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.camunda.spin.Spin.JSON;
/*
Testing with:
{
  "answers": [
    {
      "questionId": "87e378a2-10b0-43b7-9c90-67fd03d8b8b3",
      "options": "true",
      "type": "TrueOrFalse"
    },
     {
      "questionId": "87e378a2-10b0-43b7-9c90-67fd03d8b8b3",
      "options": "false",
      "type": "TrueOrFalse"
    }
  ]
}
 */


@Service
@AllArgsConstructor
public class LessonService {
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

    private final LessonRepository lessonRepository;
    private QuestionRepository questionRepository;

    public int evaluateLesson(String lessonId, SpinJsonNode lessonResult) {

        System.out.println("Validating ... lessonResult");
        System.out.println(lessonResult);

        JsonValidator.validateJson(lessonResult.toString());

        System.out.println("VALID IN LESSON SERVICE");

        LessonResult lessonResultObject = JSON(lessonResult).mapTo(LessonResult.class);
        int totalPoints = 0;

        List<AnswerResult> results = new LinkedList<>();

        lessonResultObject.getAnswers().forEach(a -> {
            System.out.println(a.getQuestionId());
            System.out.println(a.getOptions());
            System.out.println(a.getType());
        });

        for (Answer answer : lessonResultObject.getAnswers()) {
            AnswerResult res = evaluateQuestionType(answer.getType(), answer);
            if (res != null) {
                results.add(res);
                totalPoints += res.getScore();
            }
        }

        System.out.println(results);

        return totalPoints;
    }

    private AnswerResult evaluateQuestionType(String type, Answer answer) {
        String lowerCaseType = type.toLowerCase().trim();

        switch (lowerCaseType) {
            case "trueorfalse" -> {
                return evaluateTrueOrFalse(answer);
            }
            case "multiplechoice" -> {
                return evaluateMultipleChoice(answer);
            }
            case "slider" -> {
                return evaluateSlider(answer);
            }
            case "qualification" -> {
                return evaluateProductQualification(answer);
            }
            default -> {
                System.out.println("Unrecognized type: " + lowerCaseType);
                return null;
            }
        }

    }

    private AnswerResult evaluateProductQualification(Answer answer) {
        return null;
    }

    private AnswerResult evaluateSlider(Answer answer) {
        return null;
    }

    private AnswerResult evaluateMultipleChoice(Answer answer) {
        return null;
    }

    private AnswerResult evaluateTrueOrFalse(Answer answer) {

        UUID questionUUID = UUID.fromString(answer.getQuestionId());
        Optional<Question> questionOptional = questionRepository.findById(questionUUID);
        AnswerResult result = new AnswerResult();

        if (questionOptional.isPresent()) {
            boolean booleanValue = Boolean.parseBoolean((String) answer.getOptions());
            boolean resultIsCorrect = false;

            Question question = questionOptional.get();
            Map<String, Object> solution = question.getSolution();
            // TODO for this to work for every question, we need to save question options in this form {value: true}
            Boolean value = (Boolean) solution.get("value");
            int score = 0;

            if (value == booleanValue) {
                resultIsCorrect = true;
                score = question.getPoints();
            }
            result.setCorrect(resultIsCorrect);
            result.setScore(score);
            return result;
        }

        return null;
    }

}

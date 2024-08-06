package inc.plab.bpmn.mapper;

import inc.plab.bpmn.model.question.option.*;
import org.camunda.spin.json.SpinJsonNode;

import static org.camunda.spin.Spin.JSON;

public class LessonMapper {

    public static LessonAnswer mapToLessonAnswer(SpinJsonNode lessonAnswerJson) {
        LessonAnswer lessonAnswer = JSON(lessonAnswerJson).mapTo(LessonAnswer.class);

        for (Answer answer : lessonAnswer.getAnswers()) {
            SpinJsonNode optionsNode = JSON(answer.getOptions());
            switch (answer.getType()) {
                case "TrueOrFalse":
                    TrueOrFalseOptions trueOrFalseOptions = optionsNode.mapTo(TrueOrFalseOptions.class);
                    answer.setOptions(trueOrFalseOptions);
                    break;
                case "MultipleChoice":
                    MultipleChoiceOptions multipleChoiceOptions = optionsNode.mapTo(MultipleChoiceOptions.class);
                    answer.setOptions(multipleChoiceOptions);
                    break;
                case "Slider":
                    SliderOptions sliderOptions = optionsNode.mapTo(SliderOptions.class);
                    answer.setOptions(sliderOptions);
                    break;
                case "Requirement":
                    RequirementOptions requirementOptions = optionsNode.mapTo(RequirementOptions.class);
                    answer.setOptions(requirementOptions);
                    break;
                default:
                    String errorMessage = "Unknown type: " + answer.getType();
                    System.err.println(errorMessage);
                    throw new IllegalArgumentException(errorMessage);
            }
        }
        return lessonAnswer;
    }
}

package inc.plab.bpmn.mapper;

import inc.plab.bpmn.model.lesson.QuestionAnswer;
import inc.plab.bpmn.model.question.option.MultipleChoiceOptions;
import inc.plab.bpmn.model.question.option.RequirementOptions;
import inc.plab.bpmn.model.question.option.SliderOptions;
import inc.plab.bpmn.model.question.option.TrueOrFalseOptions;
import org.camunda.spin.json.SpinJsonNode;

import java.util.ArrayList;
import java.util.List;

public class QuestionAnswerMapper {

    public static List<QuestionAnswer> mapToQuestionAnswer(SpinJsonNode questionsAnswersJson) {
        List<QuestionAnswer> questionAnswers = new ArrayList<>();

        for (SpinJsonNode element : questionsAnswersJson.elements()) {
            QuestionAnswer questionAnswer = new QuestionAnswer();
            questionAnswer.setQuestionId(element.prop("questionId").stringValue());
            questionAnswer.setType(element.prop("type").stringValue());

            switch (questionAnswer.getType()) {
                case "TrueOrFalse":
                    TrueOrFalseOptions trueOrFalseOptions = element.prop("options").mapTo(TrueOrFalseOptions.class);
                    questionAnswer.setOptions(trueOrFalseOptions);
                    break;
                case "MultipleChoice":
                    MultipleChoiceOptions multipleChoiceOptions = element.prop("options").mapTo(MultipleChoiceOptions.class);
                    questionAnswer.setOptions(multipleChoiceOptions);
                    break;
                case "Slider":
                    SliderOptions sliderOptions = element.prop("options").mapTo(SliderOptions.class);
                    questionAnswer.setOptions(sliderOptions);
                    break;
                case "Requirement":
                    RequirementOptions requirementOptions = element.prop("options").mapTo(RequirementOptions.class);
                    questionAnswer.setOptions(requirementOptions);
                    break;
                default:
                    String errorMessage = "Unknown type: " + questionAnswer.getType();
                    System.err.println(errorMessage);
                    throw new IllegalArgumentException(errorMessage);
            }

            questionAnswers.add(questionAnswer);
        }

        return questionAnswers;
    }
}

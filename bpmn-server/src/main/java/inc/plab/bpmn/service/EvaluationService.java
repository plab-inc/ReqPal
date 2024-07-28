package inc.plab.bpmn.service;

import inc.plab.bpmn.model.question.Question;
import inc.plab.bpmn.model.question.QuestionRepository;
import inc.plab.bpmn.model.question.evaluation.Answer;
import inc.plab.bpmn.model.question.evaluation.result.*;
import inc.plab.bpmn.model.question.option.*;
import inc.plab.bpmn.model.question.solution.MultipleChoiceSolution;
import inc.plab.bpmn.model.question.solution.RequirementSolution;
import inc.plab.bpmn.model.question.solution.SliderSolution;
import inc.plab.bpmn.model.question.solution.TrueOrFalseSolution;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
/*
TODO TESTING DATA
{
  "answers": [
    {
      "options": {
        "input": true,
        "type": "TrueOrFalse"
      },
      "type": "TrueOrFalse",
      "questionId": "87e378a2-10b0-43b7-9c90-67fd03d8b8b3"
    },
    {
      "options": {
        "type": "MultipleChoice",
        "answers":
        [
        {
          "id": 0,
          "description": "Option 1",
          "input": true
        },
        {
          "id": 1,
          "description": "Option 2",
          "input": false
        },
        {
          "id": 2,
          "description": "Option 3",
          "input": true
        }
      ]},
      "type": "MultipleChoice",
      "questionId": "4e40ad58-7aaa-4936-9eb8-3ac475ddc9c7"
    },
    {
      "options": {
        "type": "Slider",
        "input": 15,
        "minValue": 0,
        "maxValue": 20,
        "steps": 1
      },
      "type": "Slider",
      "questionId": "21ca6762-0be9-407f-8976-b10dbd20f73d"
    },
    {
      "options": {
        "type": "Requirement",
        "catalogId": "deadbc97-95b9-49a0-8b61-d4b8c07178a0",
        "productIds": [
          "2180cb13-347f-44a7-8b71-4515581f76d3",
          "51f0e68f-d189-4c04-8668-ee5ce8e1ceb6"
        ],
        "requirementId": "e5df7e41-89a7-447c-8932-ea3821ce7839",
        "askForQualification": true,
        "products": [
          {
            "id": "2180cb13-347f-44a7-8b71-4515581f76d3",
            "input": 1
          },
          {
            "id": "51f0e68f-d189-4c04-8668-ee5ce8e1ceb6",
            "input": 1
          }
        ]
      },
      "type": "Requirement",
      "questionId": "ad9b58c3-1ca1-4070-9dfc-34d61f798b34"
    }
  ]
}
 */
@Service
@AllArgsConstructor
public class EvaluationService {
    private QuestionRepository questionRepository;

    public Result evaluateQuestionType(Answer answer) {
        String lowerCaseType = answer.getType().toLowerCase().trim();

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
            case "requirement" -> {
                return evaluateRequirement(answer);
            }
            default -> {
                System.out.println("Unrecognized type: " + lowerCaseType);
                return null;
            }
        }

    }

    private Result evaluateSlider(Answer answer) {
        if (answer.getOptions() instanceof SliderOptions sliderOptions) {
            UUID questionUUID = UUID.fromString(answer.getQuestionId());
            Optional<Question> questionOptional = questionRepository.findById(questionUUID);

            if (questionOptional.isPresent()) {
                Question question = questionOptional.get();
                if (question.getSolution() instanceof SliderSolution solution) {
                    return getSliderResult(sliderOptions, solution, question);
                }
            }
        }
        return null;
    }

    private static SliderResult getSliderResult(SliderOptions sliderOptions, SliderSolution solution, Question question) {
        SliderResult sliderResult = new SliderResult(question.getId().toString(), question.getQuestionType(), 0);
        sliderResult.setCorrect(false);

        int min = Math.max(solution.getCorrectValue() - solution.getToleranceValue(), 0);
        int max = Math.min(solution.getCorrectValue() + solution.getToleranceValue(), solution.getCorrectValue());

        if (sliderOptions.getInput() >= min && sliderOptions.getInput() <= max) {
            sliderResult.setCorrect(true);
            sliderResult.setScore(question.getPoints());
        }
        return sliderResult;
    }

    private Result evaluateRequirement(Answer answer) {
        if (answer.getOptions() instanceof RequirementOptions requirementOptions) {
            UUID questionUUID = UUID.fromString(answer.getQuestionId());
            Optional<Question> questionOptional = questionRepository.findById(questionUUID);

            if (questionOptional.isPresent()) {
                Question question = questionOptional.get();
                if (question.getSolution() instanceof RequirementSolution solution) {
                    return getRequirementResult(requirementOptions, solution, question);
                }
            }
        }
        return null;
    }

    private Result getRequirementResult(RequirementOptions requirementOptions, RequirementSolution solution, Question question) {
        RequirementResult requirementResult = new RequirementResult(question.getId().toString(), question.getQuestionType(), 0);

        // get products and their qualification
        // in table product_requirements -> get relationship
        //compare with input

        return requirementResult;
    }

    private Result evaluateMultipleChoice(Answer answer) {
        if (answer.getOptions() instanceof MultipleChoiceOptions multipleChoiceOptions) {

            UUID questionUUID = UUID.fromString(answer.getQuestionId());

            Optional<Question> questionOptional = questionRepository.findById(questionUUID);
            if (questionOptional.isPresent()) {
                Question question = questionOptional.get();
                // TODO save solution as {answers: [] }
                if (question.getSolution() instanceof MultipleChoiceSolution solution) {
                    return getMultipleChoiceResult(multipleChoiceOptions, solution, question);
                }
            }
        }
        return null;
    }

    private Result getMultipleChoiceResult(MultipleChoiceOptions multipleChoiceOptions, MultipleChoiceSolution solution, Question question) {
        MultipleChoiceResults result = new MultipleChoiceResults(question.getId().toString(), question.getQuestionType(), 0);

        List<MultipleChoiceOption> userAnswers = multipleChoiceOptions.getAnswers();
        List<MultipleChoiceResult> results = result.getResults();

        double pointsPerRightAnswer = (double) question.getPoints() / solution.getAnswers().size();

        solution.getAnswers().forEach(answerSolution -> {
            MultipleChoiceOption option = userAnswers.stream().filter(a -> a.getId() == answerSolution.getId()).findAny()
                    .orElse(null);
            if (option != null) {
                MultipleChoiceResult resultOption = new MultipleChoiceResult(option.getId(), option.getDescription(), option.isInput(), false);

                if (option.isInput() == answerSolution.isSolution()) {
                    resultOption.setCorrect(true);
                    result.setScore(result.getScore() + pointsPerRightAnswer);
                }
                results.add(resultOption);
            }
        });
        return result;
    }

    private Result evaluateTrueOrFalse(Answer answer) {
        if (answer.getOptions() instanceof TrueOrFalseOptions trueOrFalseOptions) {

            UUID questionUUID = UUID.fromString(answer.getQuestionId());
            Optional<Question> questionOptional = questionRepository.findById(questionUUID);

            if (questionOptional.isPresent()) {
                Question question = questionOptional.get();
                if (question.getSolution() instanceof TrueOrFalseSolution solution) {
                    // TODO for this to work for every question, we need to save question options in this form {value: true}
                    return getTrueOrFalseResult(trueOrFalseOptions, solution, question);
                }
            }
        } else {
            System.out.println("Unrecognized options for type TrueOrFalse");
        }
        return null;
    }

    private TrueOrFalseResult getTrueOrFalseResult(TrueOrFalseOptions trueOrFalseOptions, TrueOrFalseSolution solution, Question question) {
        TrueOrFalseResult result = new TrueOrFalseResult(question.getId().toString(), question.getQuestionType(), question.getPoints());
        result.setCorrect(false);
        if (solution.isValue() == trueOrFalseOptions.isInput()) {
            result.setCorrect(true);
            result.setScore(question.getPoints());
        }
        return result;
    }
}

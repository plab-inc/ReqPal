package inc.plab.bpmn.service;

import inc.plab.bpmn.model.question.evaluation.*;
import inc.plab.bpmn.model.question.evaluation.result.*;
import inc.plab.bpmn.validation.JsonValidator;
import inc.plab.bpmn.model.question.option.*;
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

TODO adjust frontend to send in this format (to change: trueorfalse, multiple choice)
{
  "answers": [
    {
      "options": {
        "input": true
      },
      "type": "TrueOrFalse",
      "questionId": "87e378a2-10b0-43b7-9c90-67fd03d8b8b3"
    },
    {
      "options": {
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
    },
    {
      "options": {
        "catalogId": "deadbc97-95b9-49a0-8b61-d4b8c07178a0",
        "productIds": [],
        "requirementId": "e5df7e41-89a7-447c-8932-ea3821ce7839",
        "askForQualification": false,
        "products": []
      },
      "type": "Requirement",
      "questionId": "de4173b1-f306-47bd-acdb-620aae57fb87"
    }
  ]
}
 */

@Service
@AllArgsConstructor
public class LessonService {
    final EvaluationService evaluationService;

    public LessonResult evaluateLesson(String lessonId, SpinJsonNode lessonAnswer) {
        JsonValidator.validateJson(lessonAnswer.toString());

        LessonAnswer lessonAnswerObject = mapToLessonAnswer(lessonAnswer);

        LessonResult lessonResult = new LessonResult();
        lessonResult.setLessonId(lessonId);
        List<Result> results = lessonResult.getResults();

        for (Answer answer : lessonAnswerObject.getAnswers()) {
            Result res = evaluationService.evaluateQuestionType(answer);
            if (res != null) {
                results.add(res);
                lessonResult.addPointsToTotalScore(res.getScore());
            }
        }
        System.out.println("=====================");
        System.out.println("Finished evaluating:");

        for (Result result : lessonResult.getResults()) {
            System.out.println("Result " + result.getQuestionId());
            System.out.println("Result " + result.getScore());
        }
        System.out.println("=====================");
        System.out.println("totalPoints");
        System.out.println(lessonResult.getTotalScore());
        return lessonResult;
    }

    public LessonAnswer mapToLessonAnswer(SpinJsonNode lessonAnswerJson) {
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
                    System.out.println("Unknown type: " + answer.getType());
            }
        }
        return lessonAnswer;
    }

    //todo remove when not needed anymore
    private void loggingForTesting(LessonAnswer lessonAnswer) {
        lessonAnswer.getAnswers().forEach(answer -> {
            // Ausgabe des Typs der Antwort
            System.out.println("Type: " + answer.getType());

            // Ausgabe der Optionen basierend auf dem Typ
            if ("TrueOrFalse".equalsIgnoreCase(answer.getType())) {
                if (answer.getOptions() instanceof TrueOrFalseOptions options) {
                    System.out.println("TrueOrFalse Options: " + options.isInput());
                } else {
                    System.out.println("Options are not of type TrueOrFalseOptions.");
                }
            } else if ("MultipleChoice".equalsIgnoreCase(answer.getType())) {
                if (answer.getOptions() instanceof MultipleChoiceOptions options) {
                    System.out.println("MultipleChoice Options: ");
                    options.getAnswers().forEach(option -> System.out.println("ID: " + option.getId() + ", Description: " + option.getDescription() + ", Input: " + option.isInput()));
                } else {
                    System.out.println("Options are not of type MultipleChoiceOptions.");
                }
            } else if ("Slider".equalsIgnoreCase(answer.getType())) {
                if (answer.getOptions() instanceof SliderOptions options) {
                    System.out.println("Slider Options: ");
                    System.out.println("Input: " + options.getInput());
                    System.out.println("MinValue: " + options.getMinValue());
                    System.out.println("MaxValue: " + options.getMaxValue());
                    System.out.println("Steps: " + options.getSteps());
                } else {
                    System.out.println("Options are not of type SliderOptions.");
                }
            } else if ("Requirement".equalsIgnoreCase(answer.getType())) {
                if (answer.getOptions() instanceof RequirementOptions options) {
                    System.out.println("Requirement Options: ");
                    System.out.println("CatalogId: " + options.getCatalogId());
                    System.out.println("ProductIds: " + options.getProductIds());
                    System.out.println("RequirementId: " + options.getRequirementId());
                    System.out.println("AskForQualification: " + options.isAskForQualification());
                    List<Product> products = options.getProducts();
                    products.forEach(pr -> {
                        System.out.println("Product from list:");
                        System.out.println(pr.getId());
                        System.out.println(pr.getInput());
                    });
                } else {
                    System.out.println("Options are not of type RequirementOptions.");
                }
            } else {
                System.out.println("Unknown type: " + answer.getType());
            }
            System.out.println();
        });

    }

}

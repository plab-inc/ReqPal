package inc.plab.bpmn.service;

import inc.plab.bpmn.exception.InvalidAnswerOptionsException;
import inc.plab.bpmn.exception.InvalidQuestionTypeException;
import inc.plab.bpmn.model.productRequirement.ProductRequirement;
import inc.plab.bpmn.model.productRequirement.ProductRequirementRepository;
import inc.plab.bpmn.model.question.Question;
import inc.plab.bpmn.model.question.QuestionRepository;
import inc.plab.bpmn.mapper.Answer;
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

@Service
@AllArgsConstructor
public class EvaluationService {
    private QuestionRepository questionRepository;
    private ProductRequirementRepository productRequirementRepository;

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
            default -> throw new InvalidQuestionTypeException("Unknown question type: " + lowerCaseType);
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
                } else {
                    throw new InvalidAnswerOptionsException("Expected SliderSolution but found: " + question.getSolution().getClass().getSimpleName());
                }
            } else {
                throw new InvalidAnswerOptionsException("Question not found for UUID: " + questionUUID);
            }
        }
        throw new InvalidAnswerOptionsException("Unrecognized options for type Slider");
    }

    private static SliderResult getSliderResult(SliderOptions sliderOptions, SliderSolution solution, Question question) {
        SliderResult sliderResult = new SliderResult(question.getId().toString(), question.getQuestionType(), 0);
        sliderResult.setCorrect(false);
        sliderResult.setInput(sliderOptions.getInput());

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
            if (!requirementOptions.isAskForQualification()) {
                return null;
            }
            UUID questionUUID = UUID.fromString(answer.getQuestionId());
            Optional<Question> questionOptional = questionRepository.findById(questionUUID);

            if (questionOptional.isPresent()) {
                Question question = questionOptional.get();
                if (question.getSolution() instanceof RequirementSolution solution) {
                    return getRequirementResult(requirementOptions, solution, question);
                } else {
                    throw new InvalidAnswerOptionsException("Expected RequirementSolution but found: " + question.getSolution().getClass().getSimpleName());
                }
            } else {
                throw new InvalidAnswerOptionsException("Question not found for UUID: " + questionUUID);
            }
        }
        throw new InvalidAnswerOptionsException("Unrecognized options for type Requirement");
    }

    private Result getRequirementResult(RequirementOptions requirementOptions, RequirementSolution solution, Question question) {
        RequirementResult requirementResult = new RequirementResult(question.getId().toString(), question.getQuestionType(), 0);
        requirementResult.setRequirementId(requirementOptions.getRequirementId());
        List<ProductResult> productResults = requirementResult.getProductResults();

        String reqId = requirementOptions.getRequirementId();
        List<ProductOptions> productOptions = requirementOptions.getProducts();
        double pointsPerRightAnswer = (double) question.getPoints() / productOptions.size();

        productOptions.forEach(product -> {
            UUID productUUID = UUID.fromString(product.getId());
            UUID requirementUUID = UUID.fromString(reqId);
            Optional<ProductRequirement> productRequirementOptional = productRequirementRepository.findByProductIdAndRequirementId(productUUID, requirementUUID);
            if (productRequirementOptional.isPresent()) {
                ProductRequirement productRequirement = productRequirementOptional.get();

                ProductResult productResult = new ProductResult();
                productResult.setId(product.getId());
                productResult.setCorrect(false);
                productResult.setInput(product.getInput());

                int min = Math.max(productRequirement.getQualification() - solution.getToleranceValue(), 0);
                int max = Math.min(productRequirement.getQualification() + solution.getToleranceValue(), productRequirement.getQualification());

                if (product.getInput() >= min && product.getInput() <= max) {
                    productResult.setCorrect(true);
                    requirementResult.addPointsToScore(pointsPerRightAnswer);
                }
                productResults.add(productResult);
            }
        });
        return requirementResult;
    }

    private Result evaluateMultipleChoice(Answer answer) {
        if (answer.getOptions() instanceof MultipleChoiceOptions multipleChoiceOptions) {

            UUID questionUUID = UUID.fromString(answer.getQuestionId());

            Optional<Question> questionOptional = questionRepository.findById(questionUUID);
            if (questionOptional.isPresent()) {
                Question question = questionOptional.get();
                if (question.getSolution() instanceof MultipleChoiceSolution solution) {
                    return getMultipleChoiceResult(multipleChoiceOptions, solution, question);
                } else {
                    throw new InvalidAnswerOptionsException("Expected MultipleChoiceSolution but found: " + question.getSolution().getClass().getSimpleName());
                }
            } else {
                throw new InvalidAnswerOptionsException("Question not found for UUID: " + questionUUID);
            }
        }
        throw new InvalidAnswerOptionsException("Unrecognized options for type MultipleChoice");
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
                MultipleChoiceResult resultOption = new MultipleChoiceResult(option.getId(), option.isInput(), false);

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
                    return getTrueOrFalseResult(trueOrFalseOptions, solution, question);
                } else {
                    throw new InvalidAnswerOptionsException("Expected TrueOrFalseSolution but found: " + question.getSolution().getClass().getSimpleName());
                }
            } else {
                throw new InvalidAnswerOptionsException("Question not found for UUID: " + questionUUID);
            }
        }
        throw new InvalidAnswerOptionsException("Unrecognized options for type TrueOrFalse");
    }

    private TrueOrFalseResult getTrueOrFalseResult(TrueOrFalseOptions trueOrFalseOptions, TrueOrFalseSolution solution, Question question) {
        TrueOrFalseResult result = new TrueOrFalseResult(question.getId().toString(), question.getQuestionType(), 0);
        result.setCorrect(false);
        if (solution.isValue() == trueOrFalseOptions.isInput()) {
            result.setCorrect(true);
            result.setScore(question.getPoints());
        }
        return result;
    }
}

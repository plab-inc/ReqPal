package inc.plab.bpmn.model.scenarioStatistics.converter.lessonResults;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import inc.plab.bpmn.model.question.evaluation.LessonResult;
import inc.plab.bpmn.model.question.evaluation.result.*;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Converter
public class LessonResultConverter implements AttributeConverter<List<LessonResult>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<LessonResult> lessonResults) {
        try {
            return objectMapper.writeValueAsString(lessonResults);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not convert lesson results to JSON string", e);
        }
    }

    @Override
    public List<LessonResult> convertToEntityAttribute(String json) {
        try {
            if (json == null || json.isEmpty() || json.equals("null")) {
                return null;
            }

            List<Map<String, Object>> resultMaps = objectMapper.readValue(json, new TypeReference<>() {
            });
            List<LessonResult> lessonResults = new ArrayList<>();

            for (Map<String, Object> resultMap : resultMaps) {
                LessonResult lessonResult = new LessonResult();
                lessonResult.setLessonId((String) resultMap.get("lessonId"));
                lessonResult.setTotalScore((Double) resultMap.get("totalScore"));

                List<Map<String, Object>> resultsList = (List<Map<String, Object>>) resultMap.get("results");

                for (Map<String, Object> result : resultsList) {
                    String type = (String) result.get("type");
                    Result mappedResult = switch (type) {
                        case "MultipleChoice" -> objectMapper.convertValue(result, MultipleChoiceResults.class);
                        case "TrueOrFalse" -> objectMapper.convertValue(result, TrueOrFalseResult.class);
                        case "Slider" -> objectMapper.convertValue(result, SliderResult.class);
                        case "Requirement" -> objectMapper.convertValue(result, RequirementResult.class);
                        default -> throw new IllegalArgumentException("Unknown result type: " + type);
                    };

                    lessonResult.getResults().add(mappedResult);
                }

                lessonResults.add(lessonResult);
            }
            return lessonResults;
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not convert JSON string to lesson results", e);
        }
    }
}


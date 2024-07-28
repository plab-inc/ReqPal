package inc.plab.bpmn.model.question.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import inc.plab.bpmn.model.question.solution.*;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.Map;

@Converter
public class SolutionConverter implements AttributeConverter<Solution, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Solution solution) {
        try {
            return objectMapper.writeValueAsString(solution);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not convert solution to JSON string", e);
        }
    }

    @Override
    public Solution convertToEntityAttribute(String json) {
        try {
            // TODO for this to work we need to save the type in the solution json
            if (objectMapper.readValue(json, Map.class) == null) {
                return null;
            }
            Map<String, Object> map = objectMapper.readValue(json, new TypeReference<>() {
            });
            String type = (String) map.get("type");

            if ("MultipleChoice".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, MultipleChoiceSolution.class);
            } else if ("TrueOrFalse".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, TrueOrFalseSolution.class);
            } else if ("Slider".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, SliderSolution.class);
            } else if ("Requirement".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, RequirementSolution.class);
            } else {
                return null;
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not convert JSON string to solution", e);
        }
    }
}


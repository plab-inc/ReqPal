package inc.plab.bpmn.model.question;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import inc.plab.bpmn.model.question.solution.MultipleChoiceSolution;
import inc.plab.bpmn.model.question.solution.Solution;
import inc.plab.bpmn.model.question.solution.TrueOrFalseSolution;
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
            System.out.println("solution");
            System.out.println(solution);
            return objectMapper.writeValueAsString(solution);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not convert solution to JSON string", e);
        }
    }

    @Override
    public Solution convertToEntityAttribute(String json) {
        try {
            System.out.println("converting json to entity attribute");
            System.out.println("json");
            System.out.println(json);

            // TODO for this to work we need to save the type in the solution json
            if (objectMapper.readValue(json, Map.class) == null) {
                return null;
            }
            Map<String, Object> map = objectMapper.readValue(json, Map.class);
            String type = (String) map.get("type");

            if ("MultipleChoice".equals(type)) {
                return objectMapper.readValue(json, MultipleChoiceSolution.class);
            } else if ("TrueOrFalse".equals(type)) {
                return objectMapper.readValue(json, TrueOrFalseSolution.class);
            } else {
                throw new IllegalArgumentException("Unknown solution type: " + type);
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not convert JSON string to solution", e);
        }
    }
}


package inc.plab.bpmn.model.scenarioProgress.converter.objectives;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.Map;

@Converter
public class ObjectiveConverter implements AttributeConverter<GainedObjectives, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(GainedObjectives objectives) {
        try {
            return objectMapper.writeValueAsString(objectives);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not convert gained objectives to JSON string", e);
        }
    }

    @Override
    public GainedObjectives convertToEntityAttribute(String json) {
        try {
            if (json == null || json.isEmpty() || json.equals("null")) {
                return null;
            }
            if (objectMapper.readValue(json, Map.class) == null) {
                return null;
            }
            return objectMapper.readValue(json, GainedObjectives.class);
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not convert JSON string to gained objectives", e);
        }
    }
}


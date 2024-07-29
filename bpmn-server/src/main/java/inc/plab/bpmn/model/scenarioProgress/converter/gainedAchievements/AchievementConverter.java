package inc.plab.bpmn.model.scenarioProgress.converter.gainedAchievements;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.Map;

@Converter
public class AchievementConverter implements AttributeConverter<GainedAchievements, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(GainedAchievements gainedAchievements) {
        try {
            return objectMapper.writeValueAsString(gainedAchievements);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not convert gained achievements to JSON string", e);
        }
    }

    @Override
    public GainedAchievements convertToEntityAttribute(String json) {
        try {
            if (json == null || json.isEmpty() || json.equals("null")) {
                return null;
            }
            if (objectMapper.readValue(json, Map.class) == null) {
                return null;
            }
            return objectMapper.readValue(json, GainedAchievements.class);
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not convert JSON string to gained achievements", e);
        }
    }
}


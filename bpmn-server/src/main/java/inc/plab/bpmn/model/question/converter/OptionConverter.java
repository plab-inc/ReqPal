package inc.plab.bpmn.model.question.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import inc.plab.bpmn.model.question.option.*;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.Map;

@Converter
public class OptionConverter implements AttributeConverter<Option, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Option option) {
        try {
            return objectMapper.writeValueAsString(option);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not convert option to JSON string", e);
        }
    }

    @Override
    public Option convertToEntityAttribute(String json) {
        try {
            if (objectMapper.readValue(json, Map.class) == null) {
                return null;
            }
            Map<String, Object> map = objectMapper.readValue(json, new TypeReference<>() {
            });

            String type = (String) map.get("type");

            if ("MultipleChoice".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, MultipleChoiceOptions.class);
            } else if ("TrueOrFalse".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, TrueOrFalseOptions.class);
            } else if ("Slider".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, SliderOptions.class);
            } else if ("Requirement".equalsIgnoreCase(type)) {
                return objectMapper.readValue(json, RequirementOptions.class);
            } else {
                return null;
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not convert JSON string to option", e);
        }
    }
}


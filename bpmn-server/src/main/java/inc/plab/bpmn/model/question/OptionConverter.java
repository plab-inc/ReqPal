package inc.plab.bpmn.model.question;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import inc.plab.bpmn.model.question.option.MultipleChoiceOptions;
import inc.plab.bpmn.model.question.option.Option;
import inc.plab.bpmn.model.question.option.TrueOrFalseOptions;
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
            System.out.println("option");
            System.out.println(option);
            return objectMapper.writeValueAsString(option);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not convert option to JSON string", e);
        }
    }

    @Override
    public Option convertToEntityAttribute(String json) {
        try {
            System.out.println("converting json to entity attribute");
            System.out.println("json");
            System.out.println(json);

            // TODO for this to work we need to save the type in the options json
            if (objectMapper.readValue(json, Map.class) == null) {
                return null;
            }
            Map<String, Object> map = objectMapper.readValue(json, Map.class);

            String type = (String) map.get("type");

            if ("MultipleChoice".equals(type)) {
                return objectMapper.readValue(json, MultipleChoiceOptions.class);
            } else if ("TrueOrFalse".equals(type)) {
                return objectMapper.readValue(json, TrueOrFalseOptions.class);
            } else {
                throw new IllegalArgumentException("Unknown solution type: " + type);
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not convert JSON string to solution", e);
        }
    }
}


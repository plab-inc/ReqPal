package inc.plab.bpmn.validation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import inc.plab.bpmn.exception.InvalidJsonSchemaException;

import java.io.InputStream;
import java.util.Set;

public class JsonValidator {

    public static void validateJson(String jsonString) {
        try {
            InputStream schemaStream = JsonValidator.class.getResourceAsStream("/schemas/validLessonAnswerSchema.json");
            ObjectMapper mapper = new ObjectMapper();
            JsonNode schemaNode = mapper.readTree(schemaStream);

            JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);
            JsonSchema schema = factory.getSchema(schemaNode);

            JsonNode jsonNode = mapper.readTree(jsonString);
            Set<ValidationMessage> validationResult = schema.validate(jsonNode);

            if (!validationResult.isEmpty()) {
                StringBuilder errorMessages = new StringBuilder("JSON is invalid:");
                validationResult.forEach(vm -> errorMessages.append("\n").append(vm.getMessage()));
                throw new InvalidJsonSchemaException(errorMessages.toString());
            }
        } catch (Exception e) {
            throw new InvalidJsonSchemaException("Failed to validate JSON: " + e.getMessage(), e);
        }
    }
}

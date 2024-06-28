package inc.plab.bpmn.model;

import lombok.Data;
import spinjar.com.fasterxml.jackson.annotation.JsonProperty;
import spinjar.com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

@Data
public class ProcessVariables {

    @JsonProperty("studentId")
    private String studentId;

    @JsonProperty("lessons")
    private List<Lesson> lessonResults;

    @JsonProperty("achievedPoints")
    private Integer achievedPoints;

    @JsonProperty("lastLessonAchievedPoints")
    private int lastLessonAchievedPoints;

    @JsonProperty("lastLessonCompletionTimeMinutes")
    private int lastLessonCompletionTimeMinutes;

    @JsonProperty("totalPoints")
    private int totalPoints;

    @JsonProperty("lastLessonResult")
    private JsonNode lastLessonResult;

    @JsonProperty("taskStartTime")
    private String taskStartTime;

    @JsonProperty("taskEndTime")
    private String taskEndTime;

}

@Data
class Lesson {

    @JsonProperty("lessonId")
    private String lessonId;

    @JsonProperty("lessonResult")
    private JsonNode lessonResult;

    @JsonProperty("achievedPoints")
    private Integer achievedPoints;

}

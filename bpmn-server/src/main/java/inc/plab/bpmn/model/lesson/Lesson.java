package inc.plab.bpmn.model.lesson;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "lessons", schema = "public")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uuid;
    String title;
    String description;
    int points;
    UUID userId;
    boolean published;
    boolean example;
    UUID learningGoal;
}

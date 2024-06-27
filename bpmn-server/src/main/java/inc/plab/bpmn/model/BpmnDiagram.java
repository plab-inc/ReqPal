package inc.plab.bpmn.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class BpmnDiagram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int version;
    @Column(columnDefinition = "TEXT")
    private String content;

}
package inc.plab.bpmn.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class BpmnDiagram {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private int version;
    @Column(columnDefinition = "TEXT")
    private String xmlContent;

}
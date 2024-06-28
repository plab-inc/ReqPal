package inc.plab.bpmn.model.diagram;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "bpmn_diagrams", schema = "public")
public class BpmnDiagram {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private int version;
    @Column(columnDefinition = "TEXT")
    private String xmlContent;

}
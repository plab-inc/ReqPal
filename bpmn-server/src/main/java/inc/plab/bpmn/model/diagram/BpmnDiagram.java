package inc.plab.bpmn.model.diagram;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "bpmn_diagrams")
public class BpmnDiagram {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "version", nullable = false)
    private Integer version;

    @Column(name = "xml_content")
    private String xmlContent;

}
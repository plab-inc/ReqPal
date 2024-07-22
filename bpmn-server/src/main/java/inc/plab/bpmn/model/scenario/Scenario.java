package inc.plab.bpmn.model.scenario;

import inc.plab.bpmn.model.user.Profile;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "scenarios", schema = "public")
public class Scenario {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @NotNull
    @Column(name = "title", nullable = false, length = Integer.MAX_VALUE)
    private String title;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @NotNull
    @Column(name = "deployed", nullable = false)
    private Boolean deployed = false;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @NotNull
    @Column(name = "locked", nullable = false)
    private Boolean locked = false;

    @NotNull
    @Column(name = "version", nullable = false)
    private Long version;

    @Transient
    public String getBpmnPath(){
        return String.format("%s/%s/%s.bpmn", user.getId(), this.id, this.id);
    }

}
package inc.plab.bpmn.model.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotNull
    @Column(name = "username", nullable = false, length = Integer.MAX_VALUE)
    private String username;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "teacher")
    private Profile teacher;

    @NotNull
    @ColumnDefault("'fhdo'::text")
    @Column(name = "avatar", nullable = false, length = Integer.MAX_VALUE)
    private String avatar;

    @NotNull
    @ColumnDefault("'student'::text")
    @Column(name = "role", nullable = false, length = Integer.MAX_VALUE)
    private String role;

}
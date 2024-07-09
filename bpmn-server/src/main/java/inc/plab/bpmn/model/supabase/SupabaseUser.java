package inc.plab.bpmn.model.supabase;

import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.model.user.ProfileRepository;
import inc.plab.bpmn.websecurity.SupabaseGrantedAuthority;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.OffsetDateTime;
import java.util.*;

@Getter
@Setter
@Entity
@Table(name = "users", schema = "auth")
public class SupabaseUser implements UserDetails {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Size(max = 255)
    @Column(name = "aud")
    private String aud;

    @Size(max = 255)
    @Column(name = "role")
    private String role;

    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Column(name = "raw_app_meta_data")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> rawAppMetaData;

    @Column(name = "raw_user_meta_data")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> rawUserMetaData;

    @Column(name = "is_super_admin")
    private Boolean isSuperAdmin;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "banned_until")
    private OffsetDateTime bannedUntil;

    @Column(name = "email_confirmed_at")
    private OffsetDateTime emailConfirmedAt;

    @Transient
    private Profile profile;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (rawUserMetaData != null) {
            String role = (String) rawUserMetaData.get("role");

            if (role != null) {
                authorities.add(new SupabaseGrantedAuthority("ROLE_" + role.toUpperCase()));
            }

        }

        if(role != null){
            authorities.add(new SupabaseGrantedAuthority("ROLE_" + role.toUpperCase()));
        }

        if(emailConfirmedAt != null){
            authorities.add(new SupabaseGrantedAuthority("ROLE_EMAIL_VERIFIED"));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        if (rawUserMetaData != null) {
            return (String) rawUserMetaData.get("username");
        }
        return  null;
    }
}
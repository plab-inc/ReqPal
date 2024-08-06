package inc.plab.bpmn.websecurity;

import inc.plab.bpmn.exception.TokenVerificationException;
import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.SupabaseAuthService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import javax.crypto.SecretKey;

@Component
@RequiredArgsConstructor
@Configuration
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final SupabaseAuthService supabaseAuthService;
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Value("${app.supabase.jwt.secret}")
    private String jwtSecret;

    @Qualifier("handlerExceptionResolver")
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    @SneakyThrows
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) {
        try {

            String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);

            if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith(BEARER_PREFIX)) {
                Claims claims = getClaimsFromJwtToken(authorizationHeader.replace(BEARER_PREFIX, ""));
                String userId = claims.getSubject();
                String role = claims.get("role", String.class);
                SupabaseUser userDetails = null;

                if("authenticated".equals(role)){
                    userDetails = supabaseAuthService.loadUserByUsername(userId);
                }

                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            handlerExceptionResolver.resolveException(request, response, null, new TokenVerificationException());
        }
    }

    private Claims getClaimsFromJwtToken(String token) {
        return Jwts.parser().verifyWith(getPublicSigningKey()).build().parseSignedClaims(token).getPayload();
    }

    private SecretKey getPublicSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
}
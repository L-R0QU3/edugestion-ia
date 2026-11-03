package cl.edu.edugestion.auth;

import cl.edu.edugestion.auth.dto.LoginResponse;
import cl.edu.edugestion.config.JwtService;
import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;

  public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
  }

  public LoginResponse login(String email, String password) {
    User u = users.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
    if (!u.isActivo() || !encoder.matches(password, u.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
    }
    String token = jwt.generateToken(u);
    return new LoginResponse(token, u.getEmail(),
        u.getNombres() + " " + u.getApellidos(), u.getRol().name());
  }
}
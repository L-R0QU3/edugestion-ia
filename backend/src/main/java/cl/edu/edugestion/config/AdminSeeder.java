package cl.edu.edugestion.config;

import cl.edu.edugestion.users.Role;
import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final String email;
  private final String password;

  public AdminSeeder(UserRepository users, PasswordEncoder encoder,
                     @Value("${app.admin.email}") String email,
                     @Value("${app.admin.password}") String password) {
    this.users = users;
    this.encoder = encoder;
    this.email = email;
    this.password = password;
  }

  @Override
  public void run(String... args) {
    if (users.existsByEmail(email)) return;
    users.save(User.builder()
        .rut("00000000-0")
        .nombres("Admin")
        .apellidos("Sistema")
        .email(email)
        .passwordHash(encoder.encode(password))
        .rol(Role.DIRECCION)
        .activo(true)
        .build());
  }
}
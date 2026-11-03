package cl.edu.edugestion.users;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class MeController {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public MeController(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    // Obtener los datos del usuario que tiene la sesión iniciada
    @GetMapping("/me")
    public User me(Authentication auth) {
        return users.findByEmail(auth.getName()).orElseThrow();
    }

    // Listar usuarios (Ahora permite a Dirección y Docentes)
    @GetMapping
    @PreAuthorize("hasAnyRole('DIRECCION', 'DOCENTE')")
    public List<User> listar(@RequestParam(required = false) Role rol) {
        if (rol != null) {
            return users.findAll().stream().filter(u -> u.getRol() == rol).toList();
        }
        return users.findAll();
    }

    // Crear usuario (Solo lo puede hacer la Dirección)
    @PostMapping
    @PreAuthorize("hasRole('DIRECCION')")
    public ResponseEntity<User> crear(@Valid @RequestBody User user) {
        // Asigna la clave por defecto a los nuevos usuarios
        user.setPasswordHash(encoder.encode("EduGestion2026!"));
        user.setActivo(true);
        return ResponseEntity.ok(users.save(user));
    }
}
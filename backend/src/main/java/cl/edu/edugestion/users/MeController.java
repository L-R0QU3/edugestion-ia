package cl.edu.edugestion.users;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class MeController {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public MeController(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @GetMapping("/me")
    public User me(Authentication auth) {
        return users.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA', 'JEFE_UTP', 'COORDINADOR', 'PROFESOR_JEFE', 'PROFESOR_ASIGNATURA')")
    public List<User> listar(@RequestParam(required = false) Role rol) {
        if (rol != null) {
            return users.findAll().stream().filter(u -> u.getRol() == rol).toList();
        }
        return users.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA')")
    public ResponseEntity<User> crear(@Valid @RequestBody User user) {
        user.setPasswordHash(encoder.encode("EduGestion2026!"));
        user.setActivo(true);
        return ResponseEntity.ok(users.save(user));
    }

    // NUEVO: Editar Usuario
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA')")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = users.findById(id).orElseThrow();
        
        user.setNombres(body.get("nombres"));
        user.setApellidos(body.get("apellidos"));
        user.setEmail(body.get("email"));
        user.setRut(body.get("rut"));
        
        if (body.containsKey("rol") && body.get("rol") != null) {
            user.setRol(Role.valueOf(body.get("rol")));
        }

        return ResponseEntity.ok(users.save(user));
    }

    // NUEVO: Eliminar Usuario (Borrado lógico o físico)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        users.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado"));
    }
}
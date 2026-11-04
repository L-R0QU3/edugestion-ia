package cl.edu.edugestion.guardian;

import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/guardians")
public class GuardianController {

    private final GuardianStudentRepository guardianRepo;
    private final UserRepository users;

    public GuardianController(GuardianStudentRepository guardianRepo, UserRepository users) {
        this.guardianRepo = guardianRepo;
        this.users = users;
    }

    @PostMapping("/link")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA')")
    public ResponseEntity<?> vincular(@RequestBody Map<String, String> body) {
        Long apoderadoId = Long.valueOf(body.get("apoderadoId"));
        Long estudianteId = Long.valueOf(body.get("estudianteId"));
        String parentesco = body.getOrDefault("parentesco", "Tutor");

        if (guardianRepo.existsByApoderadoIdAndEstudianteId(apoderadoId, estudianteId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Este apoderado ya está vinculado a este estudiante."));
        }

        GuardianStudent link = GuardianStudent.builder()
                .apoderadoId(apoderadoId)
                .estudianteId(estudianteId)
                .parentesco(parentesco)
                .build();
                
        return ResponseEntity.ok(guardianRepo.save(link));
    }

    @GetMapping("/mis-pupilos")
    @PreAuthorize("hasRole('APODERADO')")
    public List<User> misPupilos(Authentication auth) {
        User apoderado = users.findByEmail(auth.getName()).orElseThrow();
        List<GuardianStudent> vinculos = guardianRepo.findByApoderadoId(apoderado.getId());
        
        return vinculos.stream()
                .map(v -> users.findById(v.getEstudianteId()).orElseThrow())
                .toList();
    }
}
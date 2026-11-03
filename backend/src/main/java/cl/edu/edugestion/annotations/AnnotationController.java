package cl.edu.edugestion.annotations;

import cl.edu.edugestion.guardian.GuardianStudentRepository;
import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/annotations")
public class AnnotationController {

    private final AnotacionRepository anotaciones;
    private final UserRepository users;
    private final GuardianStudentRepository guardianRepo;

    public AnnotationController(AnotacionRepository anotaciones, UserRepository users, GuardianStudentRepository guardianRepo) {
        this.anotaciones = anotaciones;
        this.users = users;
        this.guardianRepo = guardianRepo;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<?> crearAnotacion(@RequestBody Map<String, Object> body, Authentication auth) {
        User docente = users.findByEmail(auth.getName()).orElseThrow();
        
        Anotacion a = Anotacion.builder()
            .estudianteId(Long.valueOf(body.get("estudianteId").toString()))
            .docenteId(docente.getId())
            .tipo(body.get("tipo").toString())
            .descripcion(body.get("descripcion").toString())
            .visibleApoderado(Boolean.parseBoolean(body.getOrDefault("visibleApoderado", "true").toString()))
            .build();
            
        return ResponseEntity.ok(anotaciones.save(a));
    }

    @GetMapping("/estudiante/{estudianteId}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'DIRECCION')")
    public List<Anotacion> verPorEstudiante(@PathVariable Long estudianteId) {
        return anotaciones.findByEstudianteIdOrderByFechaDesc(estudianteId);
    }

    @GetMapping("/mis-anotaciones")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public List<Anotacion> misAnotaciones(Authentication auth) {
        User est = users.findByEmail(auth.getName()).orElseThrow();
        return anotaciones.findByEstudianteIdOrderByFechaDesc(est.getId()).stream()
            .filter(Anotacion::isVisibleApoderado) // El alumno ve las mismas que el apoderado
            .toList();
    }

    @GetMapping("/pupilo/{estudianteId}")
    @PreAuthorize("hasRole('APODERADO')")
    public ResponseEntity<?> anotacionesPupilo(@PathVariable Long estudianteId, Authentication auth) {
        User apo = users.findByEmail(auth.getName()).orElseThrow();
        if (!guardianRepo.existsByApoderadoIdAndEstudianteId(apo.getId(), estudianteId)) {
            return ResponseEntity.status(403).body(Map.of("error", "No autorizado"));
        }
        
        // El apoderado solo ve las que son visibles para él
        return ResponseEntity.ok(anotaciones.findByEstudianteIdOrderByFechaDesc(estudianteId).stream()
            .filter(Anotacion::isVisibleApoderado)
            .toList());
    }
}
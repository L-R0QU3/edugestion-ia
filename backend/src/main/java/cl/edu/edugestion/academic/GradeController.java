package cl.edu.edugestion.academic;

import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/grades")
public class GradeController {

    private final CalificacionRepository grades;
    private final CursoAsignaturaRepository cursosAsig;
    private final UserRepository users;

    public GradeController(CalificacionRepository grades, CursoAsignaturaRepository cursosAsig, UserRepository users) {
        this.grades = grades;
        this.cursosAsig = cursosAsig;
        this.users = users;
    }

    @GetMapping("/mis-asignaturas")
    @PreAuthorize("hasRole('DOCENTE')")
    public List<CursoAsignatura> misAsignaturas(Authentication auth) {
        User docente = users.findByEmail(auth.getName()).orElseThrow();
        return cursosAsig.findAll().stream()
            .filter(ca -> ca.getDocenteId().equals(docente.getId())).toList();
    }

    @GetMapping("/curso/{cursoAsignaturaId}")
    @PreAuthorize("hasRole('DOCENTE')")
    public List<Calificacion> listarPorCurso(@PathVariable Long cursoAsignaturaId) {
        return grades.findByCursoAsignaturaId(cursoAsignaturaId);
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<?> registrarNota(@RequestBody Map<String, Object> body) {
        Calificacion c = Calificacion.builder()
            .estudianteId(Long.valueOf(body.get("estudianteId").toString()))
            .cursoAsignaturaId(Long.valueOf(body.get("cursoAsignaturaId").toString()))
            .nota(Double.valueOf(body.get("nota").toString()))
            .tipo(body.getOrDefault("tipo", "PRUEBA").toString())
            .build();
        return ResponseEntity.ok(grades.save(c));
    }
    @GetMapping("/mis-notas")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public List<Calificacion> misNotas(Authentication auth) {
        User estudiante = users.findByEmail(auth.getName()).orElseThrow();
        return grades.findAll().stream()
            .filter(c -> c.getEstudianteId().equals(estudiante.getId()))
            .toList();
    }
}

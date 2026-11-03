package cl.edu.edugestion.academic;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/academic")
public class AcademicController {

    private final CursoRepository cursos;
    private final AsignaturaRepository asignaturas;
    private final MatriculaRepository matriculas;
    private final CursoAsignaturaRepository cursoAsignaturas;

    public AcademicController(CursoRepository cursos, AsignaturaRepository asignaturas, 
                              MatriculaRepository matriculas, CursoAsignaturaRepository cursoAsignaturas) {
        this.cursos = cursos;
        this.asignaturas = asignaturas;
        this.matriculas = matriculas;
        this.cursoAsignaturas = cursoAsignaturas;
    }

    // --- CURSOS ---
    @GetMapping("/cursos")
    public List<Curso> listarCursos() { return cursos.findAll(); }

    @PostMapping("/cursos")
    @PreAuthorize("hasRole('DIRECCION')")
    public ResponseEntity<Curso> crearCurso(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursos.save(curso));
    }

    // --- ASIGNATURAS ---
    @GetMapping("/asignaturas")
    public List<Asignatura> listarAsignaturas() { return asignaturas.findAll(); }

    @PostMapping("/asignaturas")
    @PreAuthorize("hasRole('DIRECCION')")
    public ResponseEntity<Asignatura> crearAsignatura(@RequestBody Asignatura asignatura) {
        return ResponseEntity.ok(asignaturas.save(asignatura));
    }

    // --- MATRÍCULAS ---
    @PostMapping("/matriculas")
    @PreAuthorize("hasRole('DIRECCION')")
    public ResponseEntity<?> matricular(@RequestBody Map<String, Object> body) {
        Long estudianteId = Long.valueOf(body.get("estudianteId").toString());
        Long cursoId = Long.valueOf(body.get("cursoId").toString());
        Integer anio = Integer.valueOf(body.get("anio").toString());

        if (matriculas.existsByEstudianteIdAndCursoIdAndAnio(estudianteId, cursoId, anio)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El estudiante ya está matriculado."));
        }

        Matricula m = Matricula.builder().estudianteId(estudianteId).cursoId(cursoId).anio(anio).build();
        return ResponseEntity.ok(matriculas.save(m));
    }

    // --- ASIGNACIÓN DOCENTE ---
    @PostMapping("/curso-asignaturas")
    @PreAuthorize("hasRole('DIRECCION')")
    public ResponseEntity<?> asignarDocente(@RequestBody Map<String, Object> body) {
        try {
            CursoAsignatura ca = CursoAsignatura.builder()
                .cursoId(Long.valueOf(body.get("cursoId").toString()))
                .asignaturaId(Long.valueOf(body.get("asignaturaId").toString()))
                .docenteId(Long.valueOf(body.get("docenteId").toString()))
                .build();
            return ResponseEntity.ok(cursoAsignaturas.save(ca));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Esta asignatura ya está asignada a este curso"));
        }
    }
}
package cl.edu.edugestion.academic;

import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
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
    private final UserRepository users;

    public AcademicController(CursoRepository cursos, AsignaturaRepository asignaturas, 
                              MatriculaRepository matriculas, CursoAsignaturaRepository cursoAsignaturas,
                              UserRepository users) {
        this.cursos = cursos;
        this.asignaturas = asignaturas;
        this.matriculas = matriculas;
        this.cursoAsignaturas = cursoAsignaturas;
        this.users = users;
    }

    @GetMapping("/cursos")
    public List<Curso> listarCursos() { return cursos.findAll(); }

    @PostMapping("/cursos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA')")
    public ResponseEntity<Curso> crearCurso(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursos.save(curso));
    }

    @GetMapping("/asignaturas")
    public List<Asignatura> listarAsignaturas() { return asignaturas.findAll(); }

    @PostMapping("/asignaturas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA', 'JEFE_UTP', 'COORDINADOR')")
    public ResponseEntity<Asignatura> crearAsignatura(@RequestBody Asignatura asignatura) {
        return ResponseEntity.ok(asignaturas.save(asignatura));
    }

    @PostMapping("/matriculas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA')")
    public ResponseEntity<?> matricular(@RequestBody Map<String, Object> body) {
        Long estudianteId = Long.valueOf(body.get("estudianteId").toString());
        Long cursoId = Long.valueOf(body.get("cursoId").toString());
        Integer anio = Integer.valueOf(body.get("anio").toString());

        if (matriculas.existsByEstudianteIdAndCursoIdAndAnio(estudianteId, cursoId, anio)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El estudiante ya está matriculado en este curso."));
        }

        Matricula m = Matricula.builder()
            .estudianteId(estudianteId).cursoId(cursoId).anio(anio)
            .colegioAnterior((String) body.getOrDefault("colegioAnterior", ""))
            .direccion((String) body.getOrDefault("direccion", ""))
            .comuna((String) body.getOrDefault("comuna", ""))
            .telefonoEmergencia((String) body.getOrDefault("telefonoEmergencia", ""))
            .contactoEmergencia((String) body.getOrDefault("contactoEmergencia", ""))
            .enfermedades((String) body.getOrDefault("enfermedades", ""))
            .observaciones((String) body.getOrDefault("observaciones", ""))
            .build();
            
        return ResponseEntity.ok(matriculas.save(m));
    }

    @PostMapping("/curso-asignaturas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA', 'JEFE_UTP', 'COORDINADOR')")
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

    @GetMapping("/cursos/{cursoId}/estudiantes")
    public List<User> estudiantesPorCurso(@PathVariable Long cursoId) {
        List<Long> estudianteIds = matriculas.findAll().stream()
            .filter(m -> m.getCursoId().equals(cursoId))
            .map(m -> m.getEstudianteId())
            .toList();
        return users.findAllById(estudianteIds);
    }
}
package cl.edu.edugestion.schedules;

import cl.edu.edugestion.academic.Matricula;
import cl.edu.edugestion.academic.MatriculaRepository;
import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    private final HorarioRepository horarios;
    private final UserRepository users;
    private final MatriculaRepository matriculas;

    public ScheduleController(HorarioRepository horarios, UserRepository users, MatriculaRepository matriculas) {
        this.horarios = horarios;
        this.users = users;
        this.matriculas = matriculas;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA', 'JEFE_UTP', 'COORDINADOR')")
    public ResponseEntity<?> crearHorario(@RequestBody Map<String, String> body) {
        try {
            Horario h = Horario.builder()
                .cursoId(Long.valueOf(body.get("cursoId")))
                .asignaturaId(Long.valueOf(body.get("asignaturaId")))
                .docenteId(Long.valueOf(body.get("docenteId")))
                .diaSemana(body.get("diaSemana").toUpperCase())
                .horaInicio(java.time.LocalTime.parse(body.get("horaInicio")))
                .horaFin(java.time.LocalTime.parse(body.get("horaFin")))
                .sala(body.get("sala"))
                .build();
            return ResponseEntity.ok(horarios.save(h));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al crear el horario: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA', 'JEFE_UTP', 'COORDINADOR')")
    public ResponseEntity<?> actualizarHorario(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Horario h = horarios.findById(id).orElseThrow();
            h.setAsignaturaId(Long.valueOf(body.get("asignaturaId")));
            h.setDocenteId(Long.valueOf(body.get("docenteId")));
            h.setDiaSemana(body.get("diaSemana").toUpperCase());
            h.setHoraInicio(java.time.LocalTime.parse(body.get("horaInicio")));
            h.setHoraFin(java.time.LocalTime.parse(body.get("horaFin")));
            h.setSala(body.get("sala"));
            return ResponseEntity.ok(horarios.save(h));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al actualizar: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'SECRETARIA', 'JEFE_UTP', 'COORDINADOR')")
    public ResponseEntity<?> eliminarHorario(@PathVariable Long id) {
        horarios.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Bloque eliminado"));
    }

    @GetMapping("/curso/{cursoId}")
    public List<Horario> verPorCurso(@PathVariable Long cursoId) {
        return horarios.findByCursoId(cursoId);
    }

    @GetMapping("/mis-clases")
    @PreAuthorize("hasAnyRole('PROFESOR_JEFE', 'PROFESOR_ASIGNATURA')")
    public List<Horario> misClases(Authentication auth) {
        User docente = users.findByEmail(auth.getName()).orElseThrow();
        return horarios.findByDocenteId(docente.getId());
    }

    @GetMapping("/mis-clases-estudiante")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public List<Horario> misClasesEstudiante(Authentication auth) {
        User estudiante = users.findByEmail(auth.getName()).orElseThrow();
        List<Matricula> misMatriculas = matriculas.findByEstudianteId(estudiante.getId());
        if (misMatriculas.isEmpty()) return List.of();
        Long cursoId = misMatriculas.get(0).getCursoId();
        return horarios.findByCursoId(cursoId);
    }
}
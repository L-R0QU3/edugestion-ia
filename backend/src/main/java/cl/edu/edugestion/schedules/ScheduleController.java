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
    private final MatriculaRepository matriculas; // <-- NUEVO

    public ScheduleController(HorarioRepository horarios, UserRepository users, MatriculaRepository matriculas) {
        this.horarios = horarios;
        this.users = users;
        this.matriculas = matriculas; // <-- NUEVO
    }

    @PostMapping
    @PreAuthorize("hasRole('DIRECCION')")
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

    @GetMapping("/curso/{cursoId}")
    public List<Horario> verPorCurso(@PathVariable Long cursoId) {
        return horarios.findByCursoId(cursoId);
    }

    @GetMapping("/mis-clases")
    @PreAuthorize("hasRole('DOCENTE')")
    public List<Horario> misClases(Authentication auth) {
        User docente = users.findByEmail(auth.getName()).orElseThrow();
        return horarios.findByDocenteId(docente.getId());
    }

    // NUEVO ENDPOINT PARA ESTUDIANTES
    @GetMapping("/mis-clases-estudiante")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public List<Horario> misClasesEstudiante(Authentication auth) {
        User estudiante = users.findByEmail(auth.getName()).orElseThrow();
        // Buscamos el curso en el que está matriculado el alumno
        List<Matricula> misMatriculas = matriculas.findByEstudianteId(estudiante.getId());
        
        if (misMatriculas.isEmpty()) return List.of();
        
        Long cursoId = misMatriculas.get(0).getCursoId();
        return horarios.findByCursoId(cursoId);
    }
}
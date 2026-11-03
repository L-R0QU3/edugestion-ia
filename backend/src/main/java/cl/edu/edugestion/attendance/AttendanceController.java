package cl.edu.edugestion.attendance;

import cl.edu.edugestion.guardian.GuardianStudentRepository;
import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AsistenciaRepository asistencias;
    private final UserRepository users;
    private final GuardianStudentRepository guardianRepo;

    public AttendanceController(AsistenciaRepository asistencias, UserRepository users, GuardianStudentRepository guardianRepo) {
        this.asistencias = asistencias;
        this.users = users;
        this.guardianRepo = guardianRepo;
    }

    // Docente obtiene la asistencia de un curso en una fecha
    @GetMapping("/curso/{cursoId}/fecha/{fecha}")
    @PreAuthorize("hasAnyRole('DOCENTE', 'DIRECCION')")
    public List<Asistencia> obtenerAsistencia(@PathVariable Long cursoId, @PathVariable String fecha) {
        return asistencias.findByCursoIdAndFecha(cursoId, LocalDate.parse(fecha));
    }

    // Docente guarda la asistencia (borra la anterior si existía y guarda la nueva)
    @PostMapping
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<?> registrarAsistencia(@RequestBody Map<String, Object> body) {
        Long cursoId = Long.valueOf(body.get("cursoId").toString());
        LocalDate fecha = LocalDate.parse(body.get("fecha").toString());
        List<Map<String, Object>> registros = (List<Map<String, Object>>) body.get("registros");

        // Limpiamos los registros previos de ese día para no duplicar
        asistencias.deleteByCursoIdAndFecha(cursoId, fecha);

        for (Map<String, Object> reg : registros) {
            Asistencia a = Asistencia.builder()
                .cursoId(cursoId)
                .fecha(fecha)
                .estudianteId(Long.valueOf(reg.get("estudianteId").toString()))
                .estado(reg.get("estado").toString())
                .build();
            asistencias.save(a);
        }
        return ResponseEntity.ok(Map.of("mensaje", "Asistencia guardada con éxito"));
    }

    // Estudiante ve su propia asistencia
    @GetMapping("/mis-asistencias")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public List<Asistencia> misAsistencias(Authentication auth) {
        User est = users.findByEmail(auth.getName()).orElseThrow();
        return asistencias.findByEstudianteId(est.getId());
    }

    // Apoderado ve la asistencia de su pupilo
    @GetMapping("/pupilo/{estudianteId}")
    @PreAuthorize("hasRole('APODERADO')")
    public ResponseEntity<?> asistenciaPupilo(@PathVariable Long estudianteId, Authentication auth) {
        User apo = users.findByEmail(auth.getName()).orElseThrow();
        if (!guardianRepo.existsByApoderadoIdAndEstudianteId(apo.getId(), estudianteId)) {
            return ResponseEntity.status(403).body(Map.of("error", "No autorizado"));
        }
        return ResponseEntity.ok(asistencias.findByEstudianteId(estudianteId));
    }
}
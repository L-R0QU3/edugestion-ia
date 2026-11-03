package cl.edu.edugestion.dashboard;

import cl.edu.edugestion.academic.CalificacionRepository;
import cl.edu.edugestion.academic.CursoRepository;
import cl.edu.edugestion.academic.MatriculaRepository;
import cl.edu.edugestion.attendance.AsistenciaRepository;
import cl.edu.edugestion.guardian.GuardianStudentRepository;
import cl.edu.edugestion.library.LibroRepository;
import cl.edu.edugestion.library.PrestamoRepository;
import cl.edu.edugestion.users.Role;
import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final UserRepository users;
    private final CursoRepository cursos;
    private final LibroRepository libros;
    private final PrestamoRepository prestamos;
    private final CalificacionRepository calificaciones;
    private final AsistenciaRepository asistencias;
    private final GuardianStudentRepository guardianRepo;
    private final MatriculaRepository matriculas;

    public DashboardController(UserRepository users, CursoRepository cursos, LibroRepository libros,
                               PrestamoRepository prestamos, CalificacionRepository calificaciones,
                               AsistenciaRepository asistencias, GuardianStudentRepository guardianRepo,
                               MatriculaRepository matriculas) {
        this.users = users; this.cursos = cursos; this.libros = libros;
        this.prestamos = prestamos; this.calificaciones = calificaciones;
        this.asistencias = asistencias; this.guardianRepo = guardianRepo;
        this.matriculas = matriculas;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats(Authentication auth) {
        User user = users.findByEmail(auth.getName()).orElseThrow();
        Map<String, Object> stats = new HashMap<>();

        if (user.getRol() == Role.DIRECCION) {
            stats.put("totalEstudiantes", users.findAll().stream().filter(u -> u.getRol() == Role.ESTUDIANTE).count());
            stats.put("totalDocentes", users.findAll().stream().filter(u -> u.getRol() == Role.DOCENTE).count());
            stats.put("totalCursos", cursos.count());
            stats.put("totalLibros", libros.count());
            stats.put("prestamosActivos", prestamos.findAll().stream().filter(p -> "ACTIVO".equals(p.getEstado())).count());
        } 
        else if (user.getRol() == Role.BIBLIOTECARIO) {
            stats.put("totalLibros", libros.count());
            stats.put("prestamosActivos", prestamos.findAll().stream().filter(p -> "ACTIVO".equals(p.getEstado())).count());
        }
        else if (user.getRol() == Role.ESTUDIANTE) {
            // Promedio de notas
            List<Double> notas = calificaciones.findAll().stream()
                .filter(c -> c.getEstudianteId().equals(user.getId()))
                .map(c -> c.getNota()).toList();
            double promedio = notas.isEmpty() ? 0.0 : notas.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            stats.put("promedio", Math.round(promedio * 10.0) / 10.0); // 1 decimal
            
            // Faltas
            long ausencias = asistencias.findByEstudianteId(user.getId()).stream()
                .filter(a -> "AUSENTE".equals(a.getEstado())).count();
            stats.put("ausencias", ausencias);
            
            // Libros prestados
            long librosPrestados = prestamos.findAll().stream()
                .filter(p -> p.getUsuarioId().equals(user.getId()) && "ACTIVO".equals(p.getEstado())).count();
            stats.put("librosPrestados", librosPrestados);
        }
        else if (user.getRol() == Role.DOCENTE) {
            stats.put("cursosAsignados", matriculas.count()); // Simplificación
            stats.put("totalAnotaciones", 0); // Se puede implementar después
        }
        else if (user.getRol() == Role.APODERADO) {
            var pupilos = guardianRepo.findByApoderadoId(user.getId());
            stats.put("pupilos", pupilos.size());
        }

        return stats;
    }
}
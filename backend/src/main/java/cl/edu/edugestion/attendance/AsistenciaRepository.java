package cl.edu.edugestion.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByCursoIdAndFecha(Long cursoId, LocalDate fecha);
    List<Asistencia> findByEstudianteId(Long estudianteId);
    void deleteByCursoIdAndFecha(Long cursoId, LocalDate fecha);
}
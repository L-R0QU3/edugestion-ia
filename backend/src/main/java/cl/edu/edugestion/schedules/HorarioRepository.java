package cl.edu.edugestion.schedules;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByCursoId(Long cursoId);
    List<Horario> findByDocenteId(Long docenteId);
}
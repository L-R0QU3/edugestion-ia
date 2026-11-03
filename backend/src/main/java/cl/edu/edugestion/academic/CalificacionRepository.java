package cl.edu.edugestion.academic;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {
    List<Calificacion> findByCursoAsignaturaId(Long cursoAsignaturaId);
}
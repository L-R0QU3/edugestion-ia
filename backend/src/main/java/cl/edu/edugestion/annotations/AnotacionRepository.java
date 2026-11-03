package cl.edu.edugestion.annotations;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnotacionRepository extends JpaRepository<Anotacion, Long> {
    List<Anotacion> findByEstudianteIdOrderByFechaDesc(Long estudianteId);
}
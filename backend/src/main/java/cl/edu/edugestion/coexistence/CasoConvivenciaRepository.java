package cl.edu.edugestion.coexistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CasoConvivenciaRepository extends JpaRepository<CasoConvivencia, Long> {
    List<CasoConvivencia> findAllByOrderByFechaRegistroDesc();
}
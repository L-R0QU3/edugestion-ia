package cl.edu.edugestion.support;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketSoporteRepository extends JpaRepository<TicketSoporte, Long> {
    List<TicketSoporte> findAllByOrderByFechaCreacionDesc();
    List<TicketSoporte> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
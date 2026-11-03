package cl.edu.edugestion.guardian;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GuardianStudentRepository extends JpaRepository<GuardianStudent, Long> {
    List<GuardianStudent> findByApoderadoId(Long apoderadoId);
    boolean existsByApoderadoIdAndEstudianteId(Long apoderadoId, Long estudianteId);
}
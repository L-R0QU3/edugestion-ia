package cl.edu.edugestion.academic;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    boolean existsByEstudianteIdAndCursoIdAndAnio(Long estudianteId, Long cursoId, Integer anio);
}
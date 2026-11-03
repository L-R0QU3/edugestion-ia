package cl.edu.edugestion.academic;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "curso_asignatura")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CursoAsignatura {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name="curso_id", nullable = false) 
    private Long cursoId;
    
    @Column(name="asignatura_id", nullable = false) 
    private Long asignaturaId;
    
    @Column(name="docente_id", nullable = false) 
    private Long docenteId;
}
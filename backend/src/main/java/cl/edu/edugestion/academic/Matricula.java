package cl.edu.edugestion.academic;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "matriculas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Matricula {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "estudiante_id", nullable = false)
    private Long estudianteId;
    
    @Column(name = "curso_id", nullable = false)
    private Long cursoId;
    
    @Column(nullable = false)
    private Integer anio;
    
    @Column(name = "fecha_registro")
    private OffsetDateTime fechaRegistro;
    
    @PrePersist void onCreate() { this.fechaRegistro = OffsetDateTime.now(); }
}
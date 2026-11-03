package cl.edu.edugestion.attendance;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "asistencias")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Asistencia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name="estudiante_id", nullable = false) 
    private Long estudianteId;
    
    @Column(name="curso_id", nullable = false) 
    private Long cursoId;
    
    @Column(nullable = false) 
    private LocalDate fecha;
    
    @Column(nullable = false) 
    private String estado;
    
    @Column(name="created_at") 
    private OffsetDateTime createdAt;

    @PrePersist void onCreate() { this.createdAt = OffsetDateTime.now(); }
}
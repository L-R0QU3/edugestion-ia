package cl.edu.edugestion.academic;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "calificaciones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Calificacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name="estudiante_id", nullable = false) 
    private Long estudianteId;
    
    @Column(name="curso_asignatura_id", nullable = false) 
    private Long cursoAsignaturaId;
    
    @Column(nullable = false) 
    private Double nota;
    
    private String tipo;
    private OffsetDateTime fecha;

    @PrePersist 
    void onCreate() { 
        this.fecha = OffsetDateTime.now(); 
    }
}
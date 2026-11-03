package cl.edu.edugestion.annotations;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "anotaciones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Anotacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="estudiante_id", nullable = false) private Long estudianteId;
    @Column(name="docente_id", nullable = false) private Long docenteId;
    
    @Column(nullable = false) private String tipo;
    @Column(nullable = false, columnDefinition = "TEXT") private String descripcion;
    
    @Column(name="visible_apoderado") private boolean visibleApoderado;
    private OffsetDateTime fecha;

    @PrePersist void onCreate() { this.fecha = OffsetDateTime.now(); }
}
package cl.edu.edugestion.coexistence;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "casos_convivencia")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CasoConvivencia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="estudiante_id", nullable = false) private Long estudianteId;
    @Column(name="reportado_por_id", nullable = false) private Long reportadoPorId;
    
    @Column(nullable = false) private String categoria;
    @Column(nullable = false, columnDefinition = "TEXT") private String descripcion;
    @Column(nullable = false) private String estado;
    @Column(name="acciones_tomadas", columnDefinition = "TEXT") private String accionesTomadas;
    
    @Column(name="fecha_registro") private OffsetDateTime fechaRegistro;
    @Column(name="fecha_actualizacion") private OffsetDateTime fechaActualizacion;

    @PrePersist void onCreate() { this.fechaRegistro = OffsetDateTime.now(); }
    @PreUpdate void onUpdate() { this.fechaActualizacion = OffsetDateTime.now(); }
}
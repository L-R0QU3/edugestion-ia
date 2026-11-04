package cl.edu.edugestion.support;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tickets_soporte")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketSoporte {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="usuario_id", nullable = false) private Long usuarioId;
    @Column(nullable = false) private String asunto;
    @Column(nullable = false, columnDefinition = "TEXT") private String descripcion;
    @Column(nullable = false) private String estado;
    
    @Column(name="respuesta_admin", columnDefinition = "TEXT") private String respuestaAdmin;
    
    @Column(name="fecha_creacion") private OffsetDateTime fechaCreacion;
    @Column(name="fecha_actualizacion") private OffsetDateTime fechaActualizacion;

    @PrePersist void onCreate() { this.fechaCreacion = OffsetDateTime.now(); this.estado = "ABIERTO"; }
    @PreUpdate void onUpdate() { this.fechaActualizacion = OffsetDateTime.now(); }
}
package cl.edu.edugestion.communications;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "comunicados")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comunicado {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String titulo;
    @Column(nullable = false, columnDefinition = "TEXT") private String contenido;
    
    @Column(name="autor_id", nullable = false) private Long autorId;
    @Column(nullable = false) private String destinatario;
    
    private OffsetDateTime fecha;

    @PrePersist void onCreate() { this.fecha = OffsetDateTime.now(); }
}
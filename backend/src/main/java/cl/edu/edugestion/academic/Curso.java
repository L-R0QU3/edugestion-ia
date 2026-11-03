package cl.edu.edugestion.academic;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "cursos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Curso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nivel;
    @Column(nullable = false) private String letra;
    @Column(nullable = false) private Integer anio;
    @Column(nullable = false) private boolean activo;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist void onCreate() { this.createdAt = OffsetDateTime.now(); this.activo = true; }
}
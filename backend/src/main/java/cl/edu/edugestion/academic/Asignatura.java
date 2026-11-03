package cl.edu.edugestion.academic;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "asignaturas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Asignatura {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true) private String codigo;
    @Column(nullable = false) private String nombre;
    @Column(nullable = false) private boolean activo;

    @PrePersist void onCreate() { this.activo = true; }
}
package cl.edu.edugestion.library;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "prestamos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Prestamo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="libro_id", nullable = false) private Long libroId;
    @Column(name="usuario_id", nullable = false) private Long usuarioId;
    @Column(name="fecha_prestamo") private LocalDate fechaPrestamo;
    @Column(name="fecha_devolucion") private LocalDate fechaDevolucion;
    private String estado;

    @PrePersist void onCreate() {
        this.fechaPrestamo = LocalDate.now();
        this.estado = "ACTIVO";
    }
}
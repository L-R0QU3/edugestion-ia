package cl.edu.edugestion.library;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "libros")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Libro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String titulo;
    @Column(nullable = false) private String autor;
    private String isbn;
    private Integer anio;
    private String categoria;
    @Column(name="ejemplares_totales", nullable = false) private Integer ejemplaresTotales;
    @Column(name="ejemplares_disponibles", nullable = false) private Integer ejemplaresDisponibles;
}
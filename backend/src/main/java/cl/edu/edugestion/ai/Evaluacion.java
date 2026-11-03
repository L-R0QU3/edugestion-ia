package cl.edu.edugestion.ai;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "evaluaciones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Evaluacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false) private String titulo;
    @Column(nullable = false) private String tema;
    @Column(name="docente_id", nullable = false) private Long docenteId;
    @Column(name="fecha_creacion") private OffsetDateTime fechaCreacion;

    // ESTA ES LA MAGIA: Le decimos que la relación la maneja el campo "evaluacion" de la clase Pregunta
    @OneToMany(mappedBy = "evaluacion", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Pregunta> preguntas;

    @PrePersist 
    void onCreate() { 
        this.fechaCreacion = OffsetDateTime.now(); 
    }
}
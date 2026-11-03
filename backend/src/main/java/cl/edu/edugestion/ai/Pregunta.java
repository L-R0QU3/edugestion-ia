package cl.edu.edugestion.ai;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "preguntas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pregunta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, columnDefinition = "TEXT") 
    private String enunciado;
    
    private String tipo;

    // ESTA ES LA MAGIA: Le decimos a qué evaluación pertenece
    @ManyToOne
    @JoinColumn(name = "evaluacion_id", nullable = false)
    @JsonIgnore // Evita que al enviar la respuesta a React se cree un bucle infinito
    private Evaluacion evaluacion;
}
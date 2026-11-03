package cl.edu.edugestion.schedules;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "horarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Horario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="curso_id", nullable = false) private Long cursoId;
    @Column(name="asignatura_id", nullable = false) private Long asignaturaId;
    @Column(name="docente_id", nullable = false) private Long docenteId;
    
    @Column(name="dia_semana", nullable = false) private String diaSemana;
    @Column(name="hora_inicio", nullable = false) private LocalTime horaInicio;
    @Column(name="hora_fin", nullable = false) private LocalTime horaFin;
    private String sala;
}
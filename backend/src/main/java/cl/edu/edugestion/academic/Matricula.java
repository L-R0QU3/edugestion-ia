package cl.edu.edugestion.academic;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "matriculas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Matricula {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "estudiante_id", nullable = false) private Long estudianteId;
    @Column(name = "curso_id", nullable = false) private Long cursoId;
    @Column(nullable = false) private Integer anio;
    
    @Column(name="colegio_anterior") private String colegioAnterior;
    private String direccion;
    private String comuna;
    @Column(name="telefono_emergencia") private String telefonoEmergencia;
    @Column(name="contacto_emergencia") private String contactoEmergencia;
    @Column(columnDefinition = "TEXT") private String enfermedades;
    @Column(columnDefinition = "TEXT") private String observaciones;
    
    @Column(name = "fecha_registro") private OffsetDateTime fechaRegistro;
    
    @PrePersist void onCreate() { this.fechaRegistro = OffsetDateTime.now(); }
}
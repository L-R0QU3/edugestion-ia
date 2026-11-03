package cl.edu.edugestion.guardian;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "guardian_students")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GuardianStudent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name="apoderado_id", nullable = false) 
    private Long apoderadoId;
    
    @Column(name="estudiante_id", nullable = false) 
    private Long estudianteId;
    
    private String parentesco;
}
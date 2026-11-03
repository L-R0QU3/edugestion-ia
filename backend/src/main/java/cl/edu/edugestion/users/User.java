package cl.edu.edugestion.users;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 12)
  private String rut;

  @Column(nullable = false, length = 100)
  private String nombres;

  @Column(nullable = false, length = 100)
  private String apellidos;

  @Column(nullable = false, unique = true, length = 150)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(name = "rol", nullable = false)
  private Role rol;

  @Column(nullable = false)
  private boolean activo;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

  @PrePersist
  void onCreate() {
    this.createdAt = OffsetDateTime.now();
    this.activo = true;
  }
}
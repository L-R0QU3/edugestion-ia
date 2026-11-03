package cl.edu.edugestion.dashboard;

import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

  @GetMapping("/me")
  public Map<String, Object> dashboard(Authentication auth) {
    String rol = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
    return switch (rol) {
      case "DIRECCION" -> Map.of("rol", rol, "widgets", java.util.List.of("global-academic", "global-library"));
      case "DOCENTE" -> Map.of("rol", rol, "widgets", java.util.List.of("my-courses", "recent-grades"));
      case "BIBLIOTECARIO" -> Map.of("rol", rol, "widgets", java.util.List.of("active-loans", "overdue"));
      case "ESTUDIANTE" -> Map.of("rol", rol, "widgets", java.util.List.of("my-grades", "my-loans"));
      case "APODERADO" -> Map.of("rol", rol, "widgets", java.util.List.of("ward-grades", "ward-loans"));
      default -> Map.of("rol", rol, "widgets", java.util.List.of());
    };
  }
}
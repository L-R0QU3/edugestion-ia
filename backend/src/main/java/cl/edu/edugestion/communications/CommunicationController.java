package cl.edu.edugestion.communications;

import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comunicados")
public class CommunicationController {

    private final ComunicadoRepository comunicados;
    private final UserRepository users;

    public CommunicationController(ComunicadoRepository comunicados, UserRepository users) {
        this.comunicados = comunicados;
        this.users = users;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'JEFE_UTP', 'COORDINADOR', 'SECRETARIA', 'CONVIVENCIA', 'PSICOLOGO', 'PROFESOR_JEFE', 'PROFESOR_ASIGNATURA')")
    public ResponseEntity<?> crear(@RequestBody Map<String, String> body, Authentication auth) {
        User autor = users.findByEmail(auth.getName()).orElseThrow();
        Comunicado c = Comunicado.builder()
            .titulo(body.get("titulo"))
            .contenido(body.get("contenido"))
            .destinatario(body.getOrDefault("destinatario", "TODOS").toUpperCase())
            .autorId(autor.getId())
            .build();
        return ResponseEntity.ok(comunicados.save(c));
    }

    @GetMapping
    public List<Comunicado> listar(Authentication auth) {
        User usuario = users.findByEmail(auth.getName()).orElseThrow();
        String rol = usuario.getRol().name();
        
        return comunicados.findAllByOrderByFechaDesc().stream()
            .filter(c -> {
                String dest = c.getDestinatario();
                return dest.equals("TODOS") 
                    || dest.equals(rol) 
                    || dest.equals(rol + "S")
                    || rol.equals("ADMINISTRADOR") 
                    || rol.equals("DIRECTOR") 
                    || rol.equals("SECRETARIA");
            })
            .toList();
    }
}
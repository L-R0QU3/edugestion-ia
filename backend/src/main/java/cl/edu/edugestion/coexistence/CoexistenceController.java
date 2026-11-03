package cl.edu.edugestion.coexistence;

import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coexistence")
@PreAuthorize("hasRole('DIRECCION')") // Todo este módulo es confidencial
public class CoexistenceController {

    private final CasoConvivenciaRepository casos;
    private final UserRepository users;

    public CoexistenceController(CasoConvivenciaRepository casos, UserRepository users) {
        this.casos = casos;
        this.users = users;
    }

    @PostMapping
    public ResponseEntity<?> crearCaso(@RequestBody Map<String, String> body, Authentication auth) {
        User reportador = users.findByEmail(auth.getName()).orElseThrow();
        
        CasoConvivencia c = CasoConvivencia.builder()
            .estudianteId(Long.valueOf(body.get("estudianteId")))
            .reportadoPorId(reportador.getId())
            .categoria(body.get("categoria"))
            .descripcion(body.get("descripcion"))
            .estado("REGISTRADO")
            .accionesTomadas("")
            .build();
            
        return ResponseEntity.ok(casos.save(c));
    }

    @GetMapping
    public List<CasoConvivencia> listar() {
        return casos.findAllByOrderByFechaRegistroDesc();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCaso(@PathVariable Long id, @RequestBody Map<String, String> body) {
        CasoConvivencia c = casos.findById(id).orElseThrow();
        c.setEstado(body.get("estado"));
        c.setAccionesTomadas(body.get("accionesTomadas"));
        return ResponseEntity.ok(casos.save(c));
    }
}
package cl.edu.edugestion.support;

import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/support")
public class SupportController {

    private final TicketSoporteRepository tickets;
    private final UserRepository users;

    public SupportController(TicketSoporteRepository tickets, UserRepository users) {
        this.tickets = tickets;
        this.users = users;
    }

    @PostMapping
    public ResponseEntity<?> crearTicket(@RequestBody Map<String, String> body, Authentication auth) {
        User user = users.findByEmail(auth.getName()).orElseThrow();
        
        TicketSoporte t = TicketSoporte.builder()
            .usuarioId(user.getId())
            .asunto(body.get("asunto"))
            .descripcion(body.get("descripcion"))
            .build();
            
        return ResponseEntity.ok(tickets.save(t));
    }

    @GetMapping("/mis-tickets")
    public List<TicketSoporte> misTickets(Authentication auth) {
        User user = users.findByEmail(auth.getName()).orElseThrow();
        return tickets.findByUsuarioIdOrderByFechaCreacionDesc(user.getId());
    }

    @GetMapping("/todos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'JEFE_UTP', 'SECRETARIA')")
    public List<TicketSoporte> verTodos() {
        return tickets.findAllByOrderByFechaCreacionDesc();
    }

    @PutMapping("/{id}/responder")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DIRECTOR', 'JEFE_UTP', 'SECRETARIA')")
    public ResponseEntity<?> responder(@PathVariable Long id, @RequestBody Map<String, String> body) {
        TicketSoporte t = tickets.findById(id).orElseThrow();
        t.setRespuestaAdmin(body.get("respuestaAdmin"));
        t.setEstado(body.get("estado")); // ABIERTO, EN_PROCESO, CERRADO
        return ResponseEntity.ok(tickets.save(t));
    }
}
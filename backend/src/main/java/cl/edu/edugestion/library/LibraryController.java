package cl.edu.edugestion.library;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/library")
public class LibraryController {

    private final LibroRepository libros;
    private final PrestamoRepository prestamos;

    public LibraryController(LibroRepository libros, PrestamoRepository prestamos) {
        this.libros = libros;
        this.prestamos = prestamos;
    }

    // --- LIBROS ---
    @GetMapping("/libros")
    public List<Libro> listarLibros() { return libros.findAll(); }

    @PostMapping("/libros")
    @PreAuthorize("hasAnyRole('DIRECCION', 'BIBLIOTECARIO')")
    public ResponseEntity<Libro> crearLibro(@RequestBody Libro libro) {
        libro.setEjemplaresDisponibles(libro.getEjemplaresTotales());
        return ResponseEntity.ok(libros.save(libro));
    }

    // --- PRÉSTAMOS ---
    @GetMapping("/prestamos")
    public List<Prestamo> listarPrestamos() { return prestamos.findAll(); }

    @PostMapping("/prestamos")
    @PreAuthorize("hasAnyRole('DIRECCION', 'BIBLIOTECARIO')")
    public ResponseEntity<?> prestar(@RequestBody Map<String, Object> body) {
        Long libroId = Long.valueOf(body.get("libroId").toString());
        Long usuarioId = Long.valueOf(body.get("usuarioId").toString());
        
        Libro libro = libros.findById(libroId).orElseThrow();
        if (libro.getEjemplaresDisponibles() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "No hay ejemplares disponibles de este libro"));
        }

        Prestamo prestamo = Prestamo.builder()
                .libroId(libroId)
                .usuarioId(usuarioId)
                .build();
        
        libro.setEjemplaresDisponibles(libro.getEjemplaresDisponibles() - 1);
        libros.save(libro);
        
        return ResponseEntity.ok(prestamos.save(prestamo));
    }

    @PostMapping("/prestamos/{id}/devolver")
    @PreAuthorize("hasAnyRole('DIRECCION', 'BIBLIOTECARIO')")
    public ResponseEntity<?> devolver(@PathVariable Long id) {
        Prestamo prestamo = prestamos.findById(id).orElseThrow();
        if ("DEVUELTO".equals(prestamo.getEstado())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Este préstamo ya fue devuelto"));
        }

        prestamo.setEstado("DEVUELTO");
        prestamo.setFechaDevolucion(java.time.LocalDate.now());
        
        Libro libro = libros.findById(prestamo.getLibroId()).orElseThrow();
        libro.setEjemplaresDisponibles(libro.getEjemplaresDisponibles() + 1);
        
        libros.save(libro);
        return ResponseEntity.ok(prestamos.save(prestamo));
    }
}
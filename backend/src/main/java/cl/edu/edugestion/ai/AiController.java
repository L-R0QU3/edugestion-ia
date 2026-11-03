package cl.edu.edugestion.ai;

import cl.edu.edugestion.users.User;
import cl.edu.edugestion.users.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final EvaluacionRepository evaluaciones;
    private final UserRepository users;
    
    @Value("${app.ai.url}")
    private String aiUrl;
    
    @Value("${app.ai.token}")
    private String aiToken;

    public AiController(EvaluacionRepository evaluaciones, UserRepository users) {
        this.evaluaciones = evaluaciones;
        this.users = users;
    }

    @PostMapping("/evaluaciones")
    @PreAuthorize("hasAnyRole('DOCENTE', 'DIRECCION')")
    public ResponseEntity<?> generarEvaluacion(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String tema = body.get("tema").toString();
            
            // 1. Preparar la llamada al microservicio Python
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Service-Token", aiToken);
            
            Map<String, Object> requestBody = Map.of("topic", tema, "numQuestions", 3);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // 2. Hacer la petición a la IA (Python)
            ResponseEntity<Map> response = restTemplate.postForEntity(aiUrl + "/ai/generate-evaluation", request, Map.class);
            Map<String, Object> aiData = response.getBody();
            
            // 3. Buscar al docente que está haciendo la petición
            User docente = users.findByEmail(auth.getName()).orElseThrow();
            
            // 4. Crear la Evaluación base
            Evaluacion eval = Evaluacion.builder()
                .titulo(aiData.get("title").toString())
                .tema(tema)
                .docenteId(docente.getId())
                .build();
                
            // 5. Extraer las preguntas de la respuesta de la IA
            List<Map<String, String>> qList = (List<Map<String, String>>) aiData.get("questions");
            
            // 6. Crear las entidades Pregunta y enlazarlas a la Evaluación (soluciona el error de null en SQL)
            List<Pregunta> preguntas = qList.stream()
                .map(q -> Pregunta.builder()
                        .enunciado(q.get("enunciado"))
                        .tipo(q.get("tipo"))
                        .evaluacion(eval) // <-- ESTO ES LO QUE FALTABA
                        .build())
                .collect(Collectors.toList());

            // 7. Asignar la lista a la evaluación
            eval.setPreguntas(preguntas);
                
            // 8. Guardar en PostgreSQL (Hibernate guarda la evaluación y luego las preguntas con su ID)
            return ResponseEntity.ok(evaluaciones.save(eval));
            
        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error real en la consola de Docker
            return ResponseEntity.status(500).body(Map.of("error", "Error conectando con la IA: " + e.getMessage()));
        }
    }

    @GetMapping("/evaluaciones")
    @PreAuthorize("hasAnyRole('DOCENTE', 'DIRECCION')")
    public List<Evaluacion> listar() {
        return evaluaciones.findAll();
    }
}
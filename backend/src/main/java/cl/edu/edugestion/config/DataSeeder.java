package cl.edu.edugestion.config;

import cl.edu.edugestion.academic.*;
import cl.edu.edugestion.users.*;
import cl.edu.edugestion.guardian.GuardianStudent;
import cl.edu.edugestion.guardian.GuardianStudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository users;
    private final CursoRepository cursos;
    private final AsignaturaRepository asignaturas;
    private final CursoAsignaturaRepository cursoAsigs;
    private final MatriculaRepository matriculas;
    private final GuardianStudentRepository guardianRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository users, CursoRepository cursos, AsignaturaRepository asignaturas,
                      CursoAsignaturaRepository cursoAsigs, MatriculaRepository matriculas, 
                      GuardianStudentRepository guardianRepo, PasswordEncoder encoder) {
        this.users = users; this.cursos = cursos; this.asignaturas = asignaturas;
        this.cursoAsigs = cursoAsigs; this.matriculas = matriculas; 
        this.guardianRepo = guardianRepo; this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (users.findByEmail("carlos@example.com").isEmpty()) {
            // 1. Crear Docente y Estudiante
            User docente = users.save(User.builder()
                .rut("22222222-2").nombres("Carlos").apellidos("Muñoz")
                .email("carlos@example.com").passwordHash(encoder.encode("EduGestion2026!"))
                .rol(Role.DOCENTE).build());

            User estudiante = users.save(User.builder()
                .rut("11111111-1").nombres("Juan").apellidos("Pérez")
                .email("juan@example.com").passwordHash(encoder.encode("EduGestion2026!"))
                .rol(Role.ESTUDIANTE).build());

            // 2. Crear Apoderada
            User apoderada = users.save(User.builder()
                .rut("13333333-3").nombres("María").apellidos("González")
                .email("maria@example.com").passwordHash(encoder.encode("EduGestion2026!"))
                .rol(Role.APODERADO).build());

            // 3. Vincular Apoderada con Estudiante
            guardianRepo.save(GuardianStudent.builder()
                .apoderadoId(apoderada.getId())
                .estudianteId(estudiante.getId())
                .parentesco("Madre")
                .build());

            // 4. Crear Curso y Asignatura
            Curso curso = cursos.save(Curso.builder().nivel("1° Medio").letra("A").anio(2026).build());
            Asignatura asig = asignaturas.save(Asignatura.builder().codigo("MAT-01").nombre("Matemática").build());

            // 5. Asignar docente y matricular
            cursoAsigs.save(CursoAsignatura.builder().cursoId(curso.getId()).asignaturaId(asig.getId()).docenteId(docente.getId()).build());
            matriculas.save(Matricula.builder().estudianteId(estudiante.getId()).cursoId(curso.getId()).anio(2026).build());
            
            System.out.println("¡Datos de prueba generados con éxito (incluyendo Apoderada)!");
        }
    }
}
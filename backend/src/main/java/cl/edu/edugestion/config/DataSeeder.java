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
        // Usamos el director como bandera para saber si ya se sembró la base de datos
        if (users.findByEmail("director@example.com").isEmpty()) {
            String pass = encoder.encode("EduGestion2026!");

            // 1. Administrador y Directivos
            // Nota: El admin principal está en el archivo .env (admin@edugestion.local)
            users.save(User.builder().rut("10000000-1").nombres("Admin2").apellidos("Global").email("admin2@example.com").passwordHash(pass).rol(Role.ADMINISTRADOR).build());
            users.save(User.builder().rut("11111111-1").nombres("Director").apellidos("Colegio").email("director@example.com").passwordHash(pass).rol(Role.DIRECTOR).build());
            users.save(User.builder().rut("12222222-2").nombres("Jefe").apellidos("UTP").email("utp@example.com").passwordHash(pass).rol(Role.JEFE_UTP).build());
            users.save(User.builder().rut("13333333-3").nombres("Coordinador").apellidos("Academico").email("coord@example.com").passwordHash(pass).rol(Role.COORDINADOR).build());

            // 2. Docentes
            User profesor = users.save(User.builder().rut("14444444-4").nombres("Carlos").apellidos("Muñoz").email("carlos@example.com").passwordHash(pass).rol(Role.PROFESOR_ASIGNATURA).build());
            users.save(User.builder().rut("15555555-5").nombres("Ana").apellidos("Jefa").email("anajefa@example.com").passwordHash(pass).rol(Role.PROFESOR_JEFE).build());

            // 3. Administrativos y Apoyo
            users.save(User.builder().rut("16666666-6").nombres("Secretaria").apellidos("Escolar").email("secretaria@example.com").passwordHash(pass).rol(Role.SECRETARIA).build());
            users.save(User.builder().rut("17777777-7").nombres("Encargado").apellidos("Convivencia").email("convivencia@example.com").passwordHash(pass).rol(Role.CONVIVENCIA).build());
            users.save(User.builder().rut("18888888-8").nombres("Psicologo").apellidos("Escolar").email("psicologo@example.com").passwordHash(pass).rol(Role.PSICOLOGO).build());
            users.save(User.builder().rut("19999999-9").nombres("Bibliotecario").apellidos("Escolar").email("biblioteca@example.com").passwordHash(pass).rol(Role.BIBLIOTECARIO).build());

            // 4. Familias
            User estudiante = users.save(User.builder().rut("20111111-1").nombres("Juan").apellidos("Pérez").email("juan@example.com").passwordHash(pass).rol(Role.ESTUDIANTE).build());
            User apoderada = users.save(User.builder().rut("21222222-2").nombres("María").apellidos("González").email("maria@example.com").passwordHash(pass).rol(Role.APODERADO).build());

            // 5. Vinculaciones
            guardianRepo.save(GuardianStudent.builder()
                .apoderadoId(apoderada.getId())
                .estudianteId(estudiante.getId())
                .parentesco("Madre")
                .build());

            // 6. Datos Académicos de prueba
            Curso curso = cursos.save(Curso.builder().nivel("1° Medio").letra("A").anio(2026).build());
            Asignatura asig = asignaturas.save(Asignatura.builder().codigo("MAT-01").nombre("Matemática").build());
            cursoAsigs.save(CursoAsignatura.builder().cursoId(curso.getId()).asignaturaId(asig.getId()).docenteId(profesor.getId()).build());
            matriculas.save(Matricula.builder().estudianteId(estudiante.getId()).cursoId(curso.getId()).anio(2026).build());
            
            System.out.println("¡Datos de prueba generados con el nuevo organigrama de roles!");
        }
    }
}
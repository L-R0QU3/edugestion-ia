import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/toast/ToastContext';
import Modal from '../../components/Modal';

export default function AcademicPage() {
  const { showToast } = useToast();
  const [cursos, setCursos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  
  const [nivel, setNivel] = useState(''); const [letra, setLetra] = useState(''); const [anio, setAnio] = useState('2026');
  const [codigo, setCodigo] = useState(''); const [nombreAsig, setNombreAsig] = useState('');
  const [asigCursoId, setAsigCursoId] = useState(''); const [asigAsignaturaId, setAsigAsignaturaId] = useState(''); const [asigDocenteId, setAsigDocenteId] = useState('');

  const [isMatriculaOpen, setIsMatriculaOpen] = useState(false);
  const [matricula, setMatricula] = useState({
    estudianteId: '', cursoId: '', colegioAnterior: '', direccion: '', comuna: '',
    telefonoEmergencia: '', contactoEmergencia: '', enfermedades: '', observaciones: ''
  });

  const cargarDatos = async () => {
    try {
      const [resCursos, resAsig, resEst, resDoc1, resDoc2, resApo] = await Promise.all([
        api('/academic/cursos'), 
        api('/academic/asignaturas'), 
        api('/users?rol=ESTUDIANTE'), 
        api('/users?rol=PROFESOR_ASIGNATURA'), // <-- CORREGIDO
        api('/users?rol=PROFESOR_JEFE'),       // <-- CORREGIDO
        api('/users?rol=APODERADO')
      ]);
      setCursos(resCursos); 
      setAsignaturas(resAsig); 
      setEstudiantes(resEst); 
      setDocentes([...resDoc1, ...resDoc2]); // Juntamos ambos tipos de docentes
      setApoderados(resApo);
    } catch (e) { showToast(e.message, 'error'); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardarCurso = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/cursos', { method: 'POST', body: JSON.stringify({ nivel, letra, anio: parseInt(anio) }) });
      setNivel(''); setLetra(''); cargarDatos(); showToast('Curso creado', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const guardarAsignatura = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/asignaturas', { method: 'POST', body: JSON.stringify({ codigo, nombre: nombreAsig }) });
      setCodigo(''); setNombreAsig(''); cargarDatos(); showToast('Asignatura creada', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const guardarAsignacion = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/curso-asignaturas', { method: 'POST', body: JSON.stringify({ cursoId: asigCursoId, asignaturaId: asigAsignaturaId, docenteId: asigDocenteId }) });
      setAsigCursoId(''); setAsigAsignaturaId(''); setAsigDocenteId(''); showToast('Docente asignado', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const guardarMatricula = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/matriculas', { method: 'POST', body: JSON.stringify({ ...matricula, anio: 2026 }) });
      setIsMatriculaOpen(false);
      setMatricula({ estudianteId: '', cursoId: '', colegioAnterior: '', direccion: '', comuna: '', telefonoEmergencia: '', contactoEmergencia: '', enfermedades: '', observaciones: '' });
      showToast('Estudiante matriculado con éxito', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const vincularApoderado = async (e) => {
    e.preventDefault();
    try {
      await api('/guardians/link', { method: 'POST', body: JSON.stringify({ apoderadoId: e.target.apo.value, estudianteId: e.target.est.value }) });
      e.target.reset(); showToast('Apoderado vinculado', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Gestión Académica</h1>
      
      <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
        <div style={{ flex: 1, background: 'white', padding: 20, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Cursos</h2>
          <form onSubmit={guardarCurso} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input placeholder="Nivel" required value={nivel} onChange={e => setNivel(e.target.value)} style={inputStyle}/>
            <input placeholder="Letra" required value={letra} onChange={e => setLetra(e.target.value)} style={{...inputStyle, width: 80}}/>
            <input type="number" required value={anio} onChange={e => setAnio(e.target.value)} style={{...inputStyle, width: 100}}/>
            <button type="submit" style={btnStyle}>Agregar</button>
          </form>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cursos.map(c => <li key={c.id} style={liStyle}>{c.nivel} {c.letra} ({c.anio})</li>)}
          </ul>
        </div>

        <div style={{ flex: 1, background: 'white', padding: 20, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Asignaturas</h2>
          <form onSubmit={guardarAsignatura} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input placeholder="Código" required value={codigo} onChange={e => setCodigo(e.target.value)} style={{...inputStyle, width: 120}}/>
            <input placeholder="Nombre" required value={nombreAsig} onChange={e => setNombreAsig(e.target.value)} style={inputStyle}/>
            <button type="submit" style={btnStyle}>Agregar</button>
          </form>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {asignaturas.map(a => <li key={a.id} style={liStyle}><b>{a.codigo}</b> - {a.nombre}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <div style={{ flex: 1, background: 'white', padding: 20, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Asignar Docente a Curso</h2>
          <form onSubmit={guardarAsignacion} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select required value={asigCursoId} onChange={e => setAsigCursoId(e.target.value)} style={inputStyle}>
              <option value="">Curso...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
            </select>
            <select required value={asigAsignaturaId} onChange={e => setAsigAsignaturaId(e.target.value)} style={inputStyle}>
              <option value="">Asignatura...</option>
              {asignaturas.map(a => <option key={a.id} value={a.id}>{a.codigo} - {a.nombre}</option>)}
            </select>
            <select required value={asigDocenteId} onChange={e => setAsigDocenteId(e.target.value)} style={inputStyle}>
              <option value="">Docente...</option>
              {docentes.map(d => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
            </select>
            <button type="submit" style={btnStyle}>Asignar</button>
          </form>
        </div>

        <div style={{ flex: 1, background: 'white', padding: 20, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Vincular Apoderado</h2>
          <form onSubmit={vincularApoderado} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select name="apo" required style={inputStyle}>
              <option value="">Apoderado...</option>
              {apoderados.map(a => <option key={a.id} value={a.id}>{a.nombres} {a.apellidos}</option>)}
            </select>
            <select name="est" required style={inputStyle}>
              <option value="">Estudiante...</option>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
            </select>
            <button type="submit" style={btnStyle}>Vincular</button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <button onClick={() => setIsMatriculaOpen(true)} style={{...btnStyle, padding: '15px 30px', fontSize: 16}}>
          📝 Abrir Ficha de Matrícula Profesional
        </button>
      </div>

      <Modal isOpen={isMatriculaOpen} onClose={() => setIsMatriculaOpen(false)} title="Ficha de Matrícula Escolar">
        <form onSubmit={guardarMatricula} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div style={{ display: 'flex', gap: 15 }}>
            <select required value={matricula.estudianteId} onChange={e => setMatricula({...matricula, estudianteId: e.target.value})} style={inp}>
              <option value="">Seleccione Estudiante...</option>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
            </select>
            <select required value={matricula.cursoId} onChange={e => setMatricula({...matricula, cursoId: e.target.value})} style={inp}>
              <option value="">Seleccione Curso...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
            </select>
          </div>

          <h4 style={{ margin: '10px 0 0 0', color: 'var(--color-navy)' }}>Antecedentes Personales</h4>
          <input placeholder="Colegio de Procedencia" value={matricula.colegioAnterior} onChange={e => setMatricula({...matricula, colegioAnterior: e.target.value})} style={inp} />
          <div style={{ display: 'flex', gap: 15 }}>
            <input placeholder="Dirección (Calle y Número)" value={matricula.direccion} onChange={e => setMatricula({...matricula, direccion: e.target.value})} style={{...inp, flex: 2}} />
            <input placeholder="Comuna" value={matricula.comuna} onChange={e => setMatricula({...matricula, comuna: e.target.value})} style={{...inp, flex: 1}} />
          </div>

          <h4 style={{ margin: '10px 0 0 0', color: 'var(--color-navy)' }}>Contacto de Emergencia</h4>
          <div style={{ display: 'flex', gap: 15 }}>
            <input placeholder="Nombre de Contacto" value={matricula.contactoEmergencia} onChange={e => setMatricula({...matricula, contactoEmergencia: e.target.value})} style={inp} />
            <input placeholder="Teléfono" value={matricula.telefonoEmergencia} onChange={e => setMatricula({...matricula, telefonoEmergencia: e.target.value})} style={inp} />
          </div>

          <h4 style={{ margin: '10px 0 0 0', color: 'var(--color-navy)' }}>Información Médica</h4>
          <textarea placeholder="Alergias, enfermedades crónicas, etc. (Opcional)" value={matricula.enfermedades} onChange={e => setMatricula({...matricula, enfermedades: e.target.value})} style={{...inp, height: 60, resize: 'none'}} />
          <textarea placeholder="Observaciones adicionales" value={matricula.observaciones} onChange={e => setMatricula({...matricula, observaciones: e.target.value})} style={{...inp, height: 60, resize: 'none'}} />

          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={() => setIsMatriculaOpen(false)} style={{...btnSecondary, flex: 1}}>Cancelar</button>
            <button type="submit" style={{...btnStyle, flex: 1}}>Guardar Matrícula</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
const inputStyle = { padding: '10px', border: '1px solid #cbd5e1', borderRadius: 6, flex: 1, fontSize: 14 };
const inp = { padding: '12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14, background: '#f8fafc' };
const btnStyle = { padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 14 };
const btnSecondary = { padding: '10px 20px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 14 };
const liStyle = { padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 14 };
import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AcademicPage() {
  const [cursos, setCursos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  
  // Estados de formularios
  const [nivel, setNivel] = useState('');
  const [letra, setLetra] = useState('');
  const [anio, setAnio] = useState('2026');
  const [codigo, setCodigo] = useState('');
  const [nombreAsig, setNombreAsig] = useState('');
  
  // Estados de matrícula
  const [estudianteId, setEstudianteId] = useState('');
  const [cursoId, setCursoId] = useState('');

  // Estados de asignación docente
  const [asigCursoId, setAsigCursoId] = useState('');
  const [asigAsignaturaId, setAsigAsignaturaId] = useState('');
  const [asigDocenteId, setAsigDocenteId] = useState('');

  const cargarDatos = async () => {
    try {
      const [resCursos, resAsig, resEst, resDoc, resApo] = await Promise.all([
        api('/academic/cursos'),
        api('/academic/asignaturas'),
        api('/users?rol=ESTUDIANTE'),
        api('/users?rol=DOCENTE'),
        api('/users?rol=APODERADO') // <-- Agregado aquí
      ]);
      setCursos(resCursos);
      setAsignaturas(resAsig);
      setEstudiantes(resEst);
      setDocentes(resDoc);
      setApoderados(resApo); // <-- Seteado aquí
    } catch (e) { alert(e.message); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardarCurso = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/cursos', { method: 'POST', body: JSON.stringify({ nivel, letra, anio: parseInt(anio) }) });
      setNivel(''); setLetra(''); cargarDatos();
    } catch (e) { alert(e.message); }
  };

  const guardarAsignatura = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/asignaturas', { method: 'POST', body: JSON.stringify({ codigo, nombre: nombreAsig }) });
      setCodigo(''); setNombreAsig(''); cargarDatos();
    } catch (e) { alert(e.message); }
  };

  const guardarMatricula = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/matriculas', { method: 'POST', body: JSON.stringify({ estudianteId, cursoId, anio: 2026 }) });
      alert('Matriculado con éxito'); setEstudianteId(''); setCursoId('');
    } catch (e) { alert(e.message); }
  };

  const guardarAsignacion = async (e) => {
    e.preventDefault();
    try {
      await api('/academic/curso-asignaturas', { 
        method: 'POST', 
        body: JSON.stringify({ cursoId: asigCursoId, asignaturaId: asigAsignaturaId, docenteId: asigDocenteId }) 
      });
      alert('Docente asignado con éxito');
      setAsigCursoId(''); setAsigAsignaturaId(''); setAsigDocenteId('');
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-navy)' }}>Gestión Académica</h1>
      
      <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
        {/* CURSOS */}
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

        {/* ASIGNATURAS */}
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

      {/* MATRÍCULAS */}
      <div style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 24, boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Matricular Estudiante</h2>
        <form onSubmit={guardarMatricula} style={{ display: 'flex', gap: 10 }}>
          <select required value={estudianteId} onChange={e => setEstudianteId(e.target.value)} style={inputStyle}>
            <option value="">Estudiante...</option>
            {estudiantes.map(u => <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>)}
          </select>
          <select required value={cursoId} onChange={e => setCursoId(e.target.value)} style={inputStyle}>
            <option value="">Curso...</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
          </select>
          <button type="submit" style={btnStyle}>Matricular</button>
        </form>
      </div>

      {/* ASIGNACIÓN DOCENTE */}
      <div style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 24, boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Asignar Docente a Curso</h2>
        <form onSubmit={guardarAsignacion} style={{ display: 'flex', gap: 10 }}>
          <select required value={asigCursoId} onChange={e => setAsigCursoId(e.target.value)} style={inputStyle}>
            <option value="">Curso...</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
          </select>
          <select required value={asigAsignaturaId} onChange={e => setAsigAsignaturaId(e.target.value)} style={inputStyle}>
            <option value="">Asignatura...</option>
            {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
          <select required value={asigDocenteId} onChange={e => setAsigDocenteId(e.target.value)} style={inputStyle}>
            <option value="">Docente...</option>
            {docentes.map(d => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
          </select>
          <button type="submit" style={btnStyle}>Asignar</button>
        </form>
      </div>

      {/* VINCULAR APODERADO */}
      <div style={{ background: 'white', padding: 20, borderRadius: 8, marginTop: 24, boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Vincular Apoderado con Estudiante</h2>
        <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await api('/guardians/link', { method: 'POST', body: JSON.stringify({ apoderadoId: e.target.apo.value, estudianteId: e.target.est.value }) });
              alert('Vinculación exitosa');
              e.target.reset();
            } catch (err) { alert(err.message); }
        }} style={{ display: 'flex', gap: 10 }}>
          <select name="apo" required style={inputStyle}>
            <option value="">Seleccione Apoderado...</option>
            {apoderados.map(a => <option key={a.id} value={a.id}>{a.nombres} {a.apellidos}</option>)}
          </select>
          <select name="est" required style={inputStyle}>
            <option value="">Seleccione Estudiante...</option>
            {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
          </select>
          <button type="submit" style={btnStyle}>Vincular</button>
        </form>
      </div>

    </div>
  );
}
const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: 4, flex: 1 };
const btnStyle = { padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' };
const liStyle = { padding: '8px 0', borderBottom: '1px solid #eee' };
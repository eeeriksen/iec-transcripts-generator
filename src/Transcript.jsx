export function Transcript({ student }) {
    return (
        <div style={{ width: '8in', height: '10.5in', padding: '1in', fontFamily: 'sans-serif', backgroundColor: 'white' }}>
            <h1 style={{ textAlign: 'center' }}>Certificado Académico</h1>
            <p>name del estudiante: <strong>{student.name}</strong></p>
            <p>course: <strong>{student.course}</strong></p>
            <p>grade final: <strong>{student.grade}</strong></p>
        </div>
    );
}
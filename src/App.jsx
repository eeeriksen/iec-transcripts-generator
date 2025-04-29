import { useRef, useState } from 'react';
import Papa from 'papaparse';
import html2pdf from 'html2pdf.js';
import { Transcript } from './Transcript';
import { Modal } from './Modal';
import { Header } from './components/Header';

export default function App() {
    const [students, setStudent] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentElements, setStudentElements] = useState([]);
    const pdfRef = useRef();

    const handleCSV = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (result) => {
                setStudent(result.data);

                const grouped = result.data.reduce((acc, student) => {
                    if (!acc[student.name]) {
                        acc[student.name] = [];
                    }
                    acc[student.name].push(student);
                    return acc;
                }, {});

                const elements = Object.keys(grouped).map((studentName) => {
                    const courses = grouped[studentName];
                    return `
                        <div class="pdf-page" style="width: 8in; height: 10.5in; padding: 1in; font-family: sans-serif; box-sizing: border-box;">
                            <h1 style="text-align:center; margin-bottom: 1rem;">Academic Certificate</h1>
                            <p><strong>Student Name:</strong> ${studentName}</p>
                            <table style="width:100%; margin-top:1rem; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th style="text-align:left; border-bottom: 2px solid #000;">Course</th>
                                        <th style="text-align:right; border-bottom: 2px solid #000;">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${courses.map(course => `
                                        <tr>
                                            <td style="padding: 8px 0;">${course.course}</td>
                                            <td style="padding: 8px 0; text-align:right;">${course.grade}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                });

                setStudentElements(elements);
            },
        });
    };


    const generatePDF = async (student) => {
        const container = pdfRef.current;
        const pages = container.querySelectorAll('.pdf-page');
        const index = Object.keys(groupedStudents).indexOf(student.name);
        const page = pages[index];


        const options = {
            filename: `carta-${student.name.replace(/\s+/g, '_')}.pdf`,
            margin: 0,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        await html2pdf().set(options).from(page).save();
    };

    const groupedStudents = students.reduce((acc, student) => {
        if (!acc[student.name]) {
            acc[student.name] = [];
        }
        acc[student.name].push(student);
        return acc;
    }, {});

    console.log(groupedStudents);
    const generarTodos = async () => {
        for (const student of students) {
            await generatePDF(student);
        }
    };

    const openModal = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <main className="pt-40 m-auto max-w-5xl flex flex-col items-center">
                <h1 className="text-sky-800 font-black mb-4 text-5xl text-center">TSU IEC Transcript PDF Generator</h1>
                <p className="text-sky-900 font-semibold mb-16 text-xl text-center">Quickly create and download professional PDF transcripts by simply uploading a CSV file with student course data</p>
                {students.length === 0 && <div className="flex flex-col items-center gap-2">
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-sky-800 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-4xl shadow-lg transition duration-200 flex items-center justify-center"
                    >
                        Upload CSV
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleCSV}
                    />
                </div>}

                {students.length > 0 && (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-sky-800">List of Students and Their Courses</h2>
                        </div>
                        <ul className="mb-12 w-full">
                            <li className="flex justify-between items-center py-2 border-b-2 border-gray-400 font-bold text-sky-800">
                                <div className="w-1/3">Name</div>
                                <div className="w-1/3">Course</div>
                                <div className="w-1/3 text-right">Grade</div>
                            </li>

                            {Object.keys(groupedStudents).map((studentName, index) => (
                                <div key={index}>
                                    {groupedStudents[studentName].map((course, i) => (
                                        <li key={i} className="flex justify-between items-center py-2">
                                            <div className="w-1/3">{i === 0 ? course.name : ''}</div>
                                            <div className="w-1/3">{course.course}</div>
                                            <div className="w-1/3 text-right">{course.grade}</div>
                                        </li>
                                    ))}
                                    <div className="border-b border-gray-300 my-2"></div>
                                </div>
                            ))}
                        </ul>
                        <button onClick={generarTodos} className="mb-12 cursor-pointer bg-sky-800 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-4xl shadow-lg transition duration-200 flex items-center justify-center">
                            Download Transcripts
                        </button>
                    </>
                )}

                {students.length > 0 && <div ref={pdfRef} className="mt-20">
                    <h2 className="text-sky-800 font-black mb-20 text-3xl text-center">Student transcripts</h2>
                    {studentElements.map((html, i) => (
                        <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
                    ))}
                </div>}
                <Modal student={selectedStudent} isOpen={modalOpen} closeModal={closeModal} />
            </main>
        </>
    );
}

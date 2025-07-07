import { useRef, useState } from 'react';
import Papa from 'papaparse';
import html2pdf from 'html2pdf.js';
import { Transcript } from './Transcript';
import { Modal } from './Modal';
import { Header } from './components/Header';
import { FileIcon } from './components/FileIcon';
import logo from './assets/logo-2.png'
import footer from './assets/footer-2.png'
import vcea from './assets/vcea.png'
import studyTennessee from './assets/study-tennessee.png'
import englishUsa from './assets/english-usa.png'
import levels1 from './assets/levels1.png'
import levels2 from './assets/levels2.png'

export default function App() {
    const pagesRef = useRef([]);
    const [students, setStudents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentElements, setStudentElements] = useState([]);
    const pdfRef = useRef();

    const handleCSV = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (result) => {
                setStudents(result.data);

                const grouped = result.data.reduce((acc, student) => {
                    if (!acc[student.name]) {
                        acc[student.name] = [];
                    }
                    acc[student.name].push(student);
                    return acc;
                }, {});

                setStudentElements(grouped);
            },
        });
    };

    const generatePDF = async (student) => {
        const container = pdfRef.current;
        const pages = container.querySelectorAll('.pdf-page');
        const index = Object.keys(groupedStudents).indexOf(student.name);
        const page = pages[index];
        console.log(page)

        console.log('Generating PDF for:', student.name);

        const options = {
            filename: `carta-${student.name.replace(/\s+/g, '_')}.pdf`,
            margin: 0,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 4 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        // await html2pdf().set(options).from(page).save();

        // otra opcion
        const html = pagesRef.current.map(el => el?.outerHTML).join('');

        console.log('HTML content:', html);

        const res = await fetch('http://localhost:3000/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ html })
        });

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.pdf';
        a.click();
    };

    const groupedStudents = students.reduce((acc, student) => {
        if (!acc[student.name]) {
            acc[student.name] = [];
        }
        acc[student.name].push(student);
        return acc;
    }, {});

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
                    {Object.keys(studentElements).map((studentName, index) => {
                        const studentData = studentElements[studentName];
                        console.log(studentData)
                        return <>
                            <div
                                key={`1page-${studentName}`}
                                className="pdf-page"
                                // style={{ width: '8.5in', height: '11in', padding: '1in', position: 'relative' }}
                                ref={(el) => (pagesRef.current[index] = el)}
                            >
                                <header>
                                    <img src={logo} alt="Logo" />
                                </header>
                                <main>
                                    <p className="title">OFFICIAL TRANSCRIPT</p>

                                    <div className="transcript-grid">

                                        <div className="grid-row row-gap-title">
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p>STUDENT INFORMATION</p></div>
                                        </div>

                                        <div className="grid-row row-4-cols">
                                            <div className="cell"><p>NAME</p></div>
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p>IEC NUMBER</p></div>
                                            <div className="cell"><p></p></div>
                                        </div>
                                        <div className="grid-row row-4-cols">
                                            <div className="cell"><p>TERM</p></div>
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p>PROGRAM</p></div>
                                            <div className="cell"><p></p></div>
                                        </div>
                                        <div className="grid-row row-4-cols">
                                            <div className="cell"><p>LEVEL</p></div>
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p>STATUS</p></div>
                                            <div className="cell"><p></p></div>
                                        </div>

                                        <div className="grid-row row-gap-title">
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p>ACADEMIC RECORDS</p></div>
                                        </div>

                                        <div className="grid-row row-grades-title">
                                            <div className="cell"><p>COURSE</p></div>
                                            <div className="cell"><p>CODE</p></div>
                                            <div className="cell"><p>MID-TERM</p></div>
                                            <div className="cell"><p>FOLLOW UP</p></div>
                                            <div className="cell"><p>PROJECT / PORTFOLIO</p></div>
                                            <div className="cell"><p>FINAL</p></div>
                                            <div className="cell"><p>COURSE SCORE</p></div>
                                            <div className="cell"><p>GRADE SCORE</p></div>
                                            <div className="cell"><p>RESULT</p></div>
                                            <div className="cell"><p>ATTENDANCE</p></div>
                                        </div>

                                        <div className="main-grid">
                                            <div className="courses-area">
                                                <div className="courses-grid">
                                                    <div className="course-row">
                                                        <div className="course-cell course-name">Matemáticas</div>
                                                        <div className="course-cell">MAT101</div>
                                                        <div className="course-cell">85</div>
                                                        <div className="course-cell">90</div>
                                                        <div className="course-cell">88</div>
                                                        <div className="course-cell">92</div>
                                                        <div className="course-cell">89</div>
                                                        <div className="course-cell grade-a">A</div>
                                                        <div className="course-cell">4.0</div>
                                                    </div>

                                                    <div className="course-row">
                                                        <div className="course-cell course-name">Historia</div>
                                                        <div className="course-cell">HIS201</div>
                                                        <div className="course-cell">78</div>
                                                        <div className="course-cell">82</div>
                                                        <div className="course-cell">85</div>
                                                        <div className="course-cell">80</div>
                                                        <div className="course-cell">81</div>
                                                        <div className="course-cell grade-b">B</div>
                                                        <div className="course-cell">3.0</div>
                                                    </div>

                                                    <div className="course-row">
                                                        <div className="course-cell course-name">Ciencias</div>
                                                        <div className="course-cell">SCI301</div>
                                                        <div className="course-cell">92</div>
                                                        <div className="course-cell">88</div>
                                                        <div className="course-cell">95</div>
                                                        <div className="course-cell">90</div>
                                                        <div className="course-cell">91</div>
                                                        <div className="course-cell grade-a">A</div>
                                                        <div className="course-cell">4.0</div>
                                                    </div>

                                                    <div className="course-row">
                                                        <div className="course-cell course-name">Inglés</div>
                                                        <div className="course-cell">ENG401</div>
                                                        <div className="course-cell">76</div>
                                                        <div className="course-cell">79</div>
                                                        <div className="course-cell">82</div>
                                                        <div className="course-cell">78</div>
                                                        <div className="course-cell">79</div>
                                                        <div className="course-cell grade-b">B</div>
                                                        <div className="course-cell">3.0</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="attendance-area">
                                                95%
                                            </div>
                                        </div>

                                        <div className="grid-row row-final-score">
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p>*LEVEL SCORE</p></div>
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p></p></div>
                                            <div className="cell"><p>PASS FAIL</p></div>
                                        </div>

                                    </div>

                                    {/* <div className="grading-scale">
                                    <img src={scalingGrade} alt="Grading Scale" />
                                </div> */}

                                    <div className="parent grading-scale">
                                        <div className="full-width blue">REMARKS</div>
                                        <div className="full-width">*For students with full-course load, the level score is calculated by taking a weighted average of all course scores for the respective level. The weighting of the course score relative to level score is determined by taking the weekly contact hours of that course into consideration. The weighting is calculated by multiplying the number of weekly hours with 4.55 and then dividing it to 100.</div>
                                        <div className="full-width blue">GRADING SCALE</div>

                                        <div className="grid-cell letter bold">A</div>
                                        <div className="grid-cell letter bold">B</div>
                                        <div className="grid-cell letter bold">C</div>
                                        <div className="grid-cell letter bold">D</div>
                                        <div className="grid-cell letter bold">F</div>
                                        <div className="grid-cell letter bold">W</div>
                                        <div className="grid-cell letter bold">I</div>
                                        <div className="grid-cell letter bold">N/A</div>

                                        <div className="grid-cell letter">100-90</div>
                                        <div className="grid-cell letter">89-80</div>
                                        <div className="grid-cell letter">79-70</div>
                                        <div className="grid-cell letter">69-60</div>
                                        <div className="grid-cell letter">59-0</div>
                                        <div className="grid-cell letter">0</div>
                                        <div className="grid-cell letter">0</div>
                                        <div className="grid-cell letter">0</div>

                                        <div className="grid-cell text"><span>Excellent</span>, work of exceptional quality which indicates the highest level of attainment in a course</div>
                                        <div className="grid-cell text"><span>Good</span>, work above average which indicates a high level of achievement</div>
                                        <div className="grid-cell text"><span>Average</span>, work of average quality representing substantial fulfillment of the minimum essentials

                                        </div>
                                        <div className="grid-cell text"><span>Poor</span>, but may represent passing if average level score is 70 and above</div>
                                        <div className="grid-cell text"><span>Failure</span>, representing unacceptable performance in the course</div>
                                        <div className="grid-cell text">Official <span>withdrawal</span> from a course or level</div>
                                        <div className="grid-cell text"><span>Incomplete</span> work</div>
                                        <div className="grid-cell text"><span>Failure</span> to meet the attendance requirement without valid reason</div>
                                    </div>

                                    <div className="signature-grid">
                                        <div className="cell head"><p>OFFICIAL SIGNATURE</p></div>
                                        <div className="cell head"><p>DATE ISSUED</p></div>
                                        <div className="cell">
                                            <p className="signature-name">Vladimir S. Betancur</p>
                                            <p className="signature-title">IEC Coordinator</p>
                                        </div>
                                        <div className="cell date"><p>20 July 3, 2025</p></div>
                                    </div>
                                </main>

                                <div className="logos">
                                    <img src={vcea} alt="VCEA" />
                                    <img src={englishUsa} alt="English USA" />
                                    <img src={studyTennessee} alt="Study Tennessee" />
                                </div>

                                <footer>
                                    <img src={footer} alt="Footer" />
                                </footer>
                            </div>

                            <div
                                key={`2page-${studentName}`}
                                className="pdf-page dos"
                            >
                                <header>
                                    <img src={logo} alt="Logo" />
                                </header>

                                <main className="levels">
                                    <img src={levels1} alt="Levels1" />
                                    <img src={levels2} alt="Levels2" />
                                </main>

                                <div className="logos dos">
                                    <img src={vcea} alt="VCEA" />
                                    <img src={englishUsa} alt="English USA" />
                                    <img src={studyTennessee} alt="Study Tennessee" />
                                </div>

                                <footer>
                                    <img src={footer} alt="Footer" />
                                </footer>
                            </div>
                        </>

                    })}
                </div>}
                <Modal student={selectedStudent} isOpen={modalOpen} closeModal={closeModal} />
            </main>
        </>
    );
}

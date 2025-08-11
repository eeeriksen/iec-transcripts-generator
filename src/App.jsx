import { useRef, useState } from 'react';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
    const [studentElements, setStudentElements] = useState([]);
    const pdfRef = useRef();

    const handleCSV = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (result) => {
                setStudents(result.data);

                const grouped = result.data.reduce((acc, student) => {
                    if (!acc[student['NAME']]) {
                        acc[student['NAME']] = [];
                    }
                    acc[student['NAME']].push(student);
                    return acc;
                }, {});

                setStudentElements(grouped);
            },
        });
    };

    const generatePDF = async () => {
        const pages = document.querySelectorAll('.pdf-page');

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });

        for (let i = 0; i < pages.length; i++) {
            const canvas = await html2canvas(pages[i], { scale: 2 }); // alta calidad
            const imgData = canvas.toDataURL('image/png');

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save('transcript.pdf');

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
                            <li className="flex justify-between text-[10px] items-center py-2 border-b-2 border-gray-400 font-bold text-sky-800">
                                <div className="w-1/18">TERM</div>
                                <div className="w-1/18">NUMBER</div>
                                <div className="w-1/18">COUNTRY</div>
                                <div className="w-1/18">VISA</div>
                                <div className="w-1/18">STATUS</div>
                                <div className="w-1/18">LEVEL</div>
                                <div className="w-1/18">PROGRAM</div>
                                <div className="w-1/18">COURSE</div>
                                <div className="w-1/18">COURSE NAME</div>
                                <div className="w-1/18">NAME</div>
                                <div className="w-1/18">MID-TERM (30%)</div>
                                <div className="w-1/18">FOLLOW-UP (10%)</div>
                                <div className="w-1/18">COURSE PROJECT(20%)</div>
                                <div className="w-1/18">FINAL (40%)</div>
                                <div className="w-1/18">COURSE SCORE</div>
                                <div className="w-1/18">COURSE GRADE</div>
                                <div className="w-1/18">RESULT</div>
                                <div className="w-1/18">ATTENDANCE</div>
                                <div className="w-1/18">COLUMN1</div>
                            </li>

                            {Object.keys(groupedStudents).map((studentName, index) => (
                                <div key={index}>
                                    {groupedStudents[studentName].map((course, i) => (
                                        <li key={i} className="flex text-[10px] justify-between items-center py-2">
                                            <div className="w-1/18">{course["TERM"]}</div>
                                            <div className="w-1/18">{course["NUMBER"]}</div>
                                            <div className="w-1/18">{course["COUNTRY"]}</div>
                                            <div className="w-1/18">{course["VISA"]}</div>
                                            <div className="w-1/18">{course["STATUS"]}</div>
                                            <div className="w-1/18">{course["LEVEL"]}</div>
                                            <div className="w-1/18">{course["PROGRAM"]}</div>
                                            <div className="w-1/18">{course["COURSE"]}</div>
                                            <div className="w-1/18">{course["COURSE NAME"]}</div>
                                            <div className="w-1/18">{course["NAME"]}</div>
                                            <div className="w-1/18">{course["MID TERM"]}</div>
                                            <div className="w-1/18">{course["FOLLOW UP"]}</div>
                                            <div className="w-1/18">{course["COURSE PROJECT"]}</div>
                                            <div className="w-1/18">{course["FINAL"]}</div>
                                            <div className="w-1/18">{course["COURSE SCORE"]}</div>
                                            <div className="w-1/18">{course["COURSE GRADE"]}</div>
                                            <div className="w-1/18">{course["RESULT"]}</div>
                                            <div className="w-1/18">{course["ATTENDANCE"]}</div>
                                            <div className="w-1/18">{course["COLUMN1"]}</div>
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

                        const averageAttendance = studentData
                            .map(course => parseFloat(course.COLUMN1.replace('%', '')))
                            .filter(attendance => !isNaN(attendance))
                            .reduce((sum, attendance, _, arr) =>
                                arr.length === 0 ? 0 : sum + attendance / arr.length, 0
                            );



                        return <div key={index} id={`student-${index}`} className="pdf-container">
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
                                            <div className="cell"><p>STUDENT INFORMATION</p></div>
                                        </div>

                                        <div className="grid-row row-4-cols">
                                            <div className="cell"><p>NAME</p></div>
                                            <div className="cell normal"><p>{studentName}</p></div>
                                            <div className="cell"><p>IEC NUMBER</p></div>
                                            <div className="cell normal"><p>{studentData[0].NUMBER}</p></div>
                                        </div>
                                        <div className="grid-row row-4-cols">
                                            <div className="cell"><p>TERM</p></div>
                                            <div className="cell normal"><p>{studentData[0].TERM}</p></div>
                                            <div className="cell"><p>PROGRAM</p></div>
                                            <div className="cell normal"><p>{studentData[0].PROGRAM}</p></div>
                                        </div>
                                        <div className="grid-row row-4-cols">
                                            <div className="cell"><p>LEVEL</p></div>
                                            <div className="cell normal"><p>{studentData[0].LEVEL}</p></div>
                                            <div className="cell"><p>STATUS</p></div>
                                            <div className="cell normal"><p>{studentData[0].STATUS}</p></div>
                                        </div>

                                        <div className="grid-row row-gap-title">
                                            <div className="cell"><p>ACADEMIC RECORDS</p></div>
                                        </div>

                                        <div className="grid-row row-grades-title">
                                            <div className="cell name"><p>COURSE</p></div>
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
                                                    {studentData.map((course, i) => (
                                                        <div key={i} className="course-row">
                                                            <div className="course-cell course-name"><p>{course['COURSE NAME']}</p></div>
                                                            <div className="course-cell"><p>{course['COURSE']}</p></div>
                                                            <div className="course-cell"><p>{course['MID TERM']}</p></div>
                                                            <div className="course-cell"><p>{course['FOLLOW UP']}</p></div>
                                                            <div className="course-cell"><p>{course['COURSE PROJECT']}</p></div>
                                                            <div className="course-cell"><p>{course['FINAL']}</p></div>
                                                            <div className="course-cell"><p>{course['COURSE SCORE']}</p></div>
                                                            <div className={`course-cell grade-${course['COURSE GRADE'].toLowerCase()}`}><p>{course['COURSE GRADE']}</p></div>
                                                            <div className="course-cell"><p>{course.RESULT}</p></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="attendance-area">
                                                <p>{`${Math.round(averageAttendance * 100 / 100)}%`}</p>
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

                                    <div className="parent grading-scale">
                                        <div className="full-width blue"><p>REMARKS</p></div>
                                        <div className="full-width"><p>*For students with full-course load, the level score is calculated by taking a weighted average of all course scores for the respective level. The weighting of the course score relative to level score is determined by taking the weekly contact hours of that course into consideration. The weighting is calculated by multiplying the number of weekly hours with 4.55 and then dividing it to 100.</p></div>
                                        <div className="full-width blue"><p>GRADING SCALE</p></div>

                                        <div className="grid-cell letter bold"><p>A</p></div>
                                        <div className="grid-cell letter bold"><p>B</p></div>
                                        <div className="grid-cell letter bold"><p>C</p></div>
                                        <div className="grid-cell letter bold"><p>D</p></div>
                                        <div className="grid-cell letter bold"><p>F</p></div>
                                        <div className="grid-cell letter bold"><p>W</p></div>
                                        <div className="grid-cell letter bold"><p>I</p></div>
                                        <div className="grid-cell letter bold"><p>N/A</p></div>

                                        <div className="grid-cell letter"><p>100-90</p></div>
                                        <div className="grid-cell letter"><p>89-80</p></div>
                                        <div className="grid-cell letter"><p>79-70</p></div>
                                        <div className="grid-cell letter"><p>69-60</p></div>
                                        <div className="grid-cell letter"><p>59-0</p></div>
                                        <div className="grid-cell letter"><p>0</p></div>
                                        <div className="grid-cell letter"><p>0</p></div>
                                        <div className="grid-cell letter"><p>0</p></div>

                                        <div className="grid-cell text"><p><span>Excellent</span>, work of exceptional quality which indicates the highest level of attainment in a course</p></div>
                                        <div className="grid-cell text"><p><span>Good</span>, work above average which indicates a high level of achievement</p></div>
                                        <div className="grid-cell text"><p><span>Average</span>, work of average quality representing substantial fulfillment of the minimum essentials</p></div>
                                        <div className="grid-cell text"><p><span>Poor</span>, but may represent passing if average level score is 70 and above</p></div>
                                        <div className="grid-cell text"><p><span>Failure</span>, representing unacceptable performance in the course</p></div>
                                        <div className="grid-cell text"><p>Official <span>withdrawal</span> from a course or level</p></div>
                                        <div className="grid-cell text"><p><span>Incomplete</span> work</p></div>
                                        <div className="grid-cell text"><p><span>Failure</span> to meet the attendance requirement without valid reason</p></div>
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
                        </div>

                    })}
                </div>}
            </main>
        </>
    );
}

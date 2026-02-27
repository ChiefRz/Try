import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ExamPage from './components/ExamPage';
import ResultPage from './components/ResultPage';

function App() {
  // Pengganti st.session_state
  const [page, setPage] = useState('landing'); // 'landing', 'exam', 'result'
  const [examData, setExamData] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [endTime, setEndTime] = useState(null);

  // Fungsi untuk memulai ujian (Mirip def load_exam)
  const startExam = async (fileName, title, durationMinutes) => {
    try {
      const response = await fetch(`/data/${fileName}`);
      const data = await response.json();
      
      setExamData(data);
      setExamTitle(title);
      setEndTime(Date.now() + durationMinutes * 60 * 1000);
      setCurrentQ(0);
      setAnswers({});
      setPage('exam');
    } catch (error) {
      alert(`Gagal memuat soal: ${fileName}`);
    }
  };

  const finishExam = () => {
    setPage('result');
  };

  const resetApp = () => {
    setPage('landing');
    setExamData([]);
    setAnswers({});
    setCurrentQ(0);
  };

  // Routing Halaman Sederhana
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans max-w-4xl mx-auto p-4">
      {page === 'landing' && (
        <LandingPage startExam={startExam} />
      )}
      {page === 'exam' && (
        <ExamPage 
          examData={examData} 
          examTitle={examTitle}
          currentQ={currentQ} 
          setCurrentQ={setCurrentQ}
          answers={answers} 
          setAnswers={setAnswers}
          endTime={endTime}
          finishExam={finishExam}
        />
      )}
      {page === 'result' && (
        <ResultPage 
          examData={examData} 
          answers={answers} 
          resetApp={resetApp} 
        />
      )}
    </div>
  );
}

export default App;
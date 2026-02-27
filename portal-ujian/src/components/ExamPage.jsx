import { useState, useEffect } from 'react';

export default function ExamPage({ 
  examData, 
  examTitle, 
  currentQ, 
  setCurrentQ, 
  answers, 
  setAnswers, 
  endTime, 
  finishExam 
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const totalQ = examData.length;
  const qData = examData[currentQ];

  // 1. LOGIKA TIMER UJIAN
  useEffect(() => {
    const timerId = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.floor((endTime - now) / 1000);
      
      if (remainingSeconds <= 0) {
        clearInterval(timerId);
        finishExam(); // Kumpulkan otomatis jika waktu habis
      } else {
        setTimeLeft(remainingSeconds);
      }
    }, 1000);

    // Bersihkan interval saat komponen dibongkar
    return () => clearInterval(timerId);
  }, [endTime, finishExam]);

  // Format detik menjadi MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 2. EFEK SCROLL KE ATAS (Pengganti trigger_scroll_to_top)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQ]);

  // 3. FUNGSI MENYIMPAN JAWABAN
  const handleSelectAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQ]: option
    });
  };

  if (!qData) return <div className="p-8 text-center">Memuat soal...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start animate-fade-in relative pt-4">
      
      {/* --- PANEL KIRI (NAVIGASI SOAL) --- */}
      {/* Di Streamlit ini adalah Sidebar. Di sini kita buat responsif (di atas kalau HP, di kiri kalau PC) */}
      <div className="w-full md:w-64 shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-200 order-2 md:order-1">
        <h3 className="font-bold text-gray-800 mb-1">📋 Navigasi Soal</h3>
        <p className="text-xs text-gray-500 mb-4">🟦 : Sudah | ⬜ : Belum</p>
        
        <div className="grid grid-cols-5 gap-2">
          {examData.map((_, index) => {
            const isAnswered = answers[index] !== undefined;
            const isCurrent = currentQ === index;
            
            // Logika styling tombol navigasi
            let btnClass = "w-full aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all ";
            if (isCurrent) {
              btnClass += "bg-blue-50 border-2 border-[#00BFFF] text-[#00BFFF] transform scale-110 shadow-sm z-10 font-bold";
            } else if (isAnswered) {
              btnClass += "bg-[#00BFFF] text-white hover:bg-[#1E90FF]";
            } else {
              btnClass += "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100";
            }

            return (
              <button
                key={index}
                onClick={() => setCurrentQ(index)}
                className={btnClass}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        <hr className="my-6 border-gray-200" />
        <button 
          onClick={finishExam}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Kumpulkan Ujian
        </button>
      </div>

      {/* --- PANEL KANAN (AREA SOAL) --- */}
      <div className="w-full flex-grow order-1 md:order-2">
        
        {/* Sticky Header & Timer */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-50 py-4 border-b border-gray-100 flex justify-between items-center mb-6 gap-4">
          <h2 className="font-bold text-base md:text-lg text-gray-800">
            {examTitle}
          </h2>
          <div className="text-lg md:text-xl font-bold text-[#F2613F] shrink-0 whitespace-nowrap">
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Pertanyaan */}
        <div className="mb-6">
          <p className="font-semibold text-gray-500 mb-2">
            Soal {currentQ + 1} dari {totalQ}
          </p>
          <p className="text-lg text-gray-800 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: qData.q }}
            />
        </div>

        {/* Pilihan Jawaban (Radio Buttons) */}
        {/* Kita buat mirip desain Streamlit kustom Anda: Kotak besar yang bisa di-klik */}
        <div className="flex flex-col gap-3 mb-10">
          {qData.opts.map((opt, idx) => {
            const isSelected = answers[currentQ] === opt;
            
            return (
              <label 
                key={idx}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? "border-[#00BFFF] bg-blue-50/50" 
                    : "border-gray-200 bg-white hover:border-[#00BFFF] hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <input 
                  type="radio" 
                  name={`question-${currentQ}`}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleSelectAnswer(opt)}
                  className="w-5 h-5 text-[#00BFFF] border-gray-300 focus:ring-[#00BFFF] mr-4"
                />
                <span className="text-gray-700 font-medium">{opt}</span>
              </label>
            );
          })}
        </div>

        {/* Tombol Navigasi Bawah */}
        <div className="flex flex-row justify-between gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={() => setCurrentQ(prev => prev - 1)}
            disabled={currentQ === 0}
            // Tambahkan whitespace-nowrap, px-3 md:px-6, dan text-sm md:text-base
            className={`py-2 px-3 md:px-6 rounded-md font-bold transition-colors text-sm md:text-base whitespace-nowrap ${
              currentQ === 0 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            &laquo; Sebelumnya
          </button>
          
          {currentQ < totalQ - 1 ? (
            <button
              onClick={() => setCurrentQ(prev => prev + 1)}
              // Tambahkan whitespace-nowrap, px-3 md:px-6, dan text-sm md:text-base
              className="py-2 px-3 md:px-6 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md font-bold transition-colors text-sm md:text-base whitespace-nowrap"
            >
              Selanjutnya &raquo;
            </button>
          ) : (
            <button
              onClick={finishExam}
              // Tambahkan whitespace-nowrap, px-3 md:px-6, dan text-sm md:text-base
              className="py-2 px-3 md:px-6 bg-[#00BFFF] hover:bg-[#1E90FF] text-white rounded-md font-bold transition-colors shadow-md text-sm md:text-base whitespace-nowrap"
            >
              Kumpulkan Ujian
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
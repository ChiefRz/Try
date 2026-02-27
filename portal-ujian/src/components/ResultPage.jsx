import { useEffect } from 'react';

export default function ResultPage({ examData, answers, resetApp }) {
  // 1. SCROLL KE ATAS SAAT HALAMAN DIMUAT
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 2. HITUNG SKOR
  const totalQ = examData.length;
  let correctCount = 0;

  // Kita iterasi semua soal untuk mencocokkan jawaban
  examData.forEach((qData, index) => {
    const userAns = answers[index];
    if (userAns === qData.answer) {
      correctCount++;
    }
  });

  const score = totalQ > 0 ? (correctCount / totalQ) * 100 : 0;
  const wrongOrEmptyCount = totalQ - correctCount;

  return (
    <div className="animate-fade-in py-6">
      
      {/* --- BAGIAN ATAS: SKOR HASIL --- */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2"> Hasil Ujian</h1>
        
        <div className="bg-gray-50 rounded-xl p-6 inline-block w-full max-w-md border border-gray-200 shadow-sm mt-4">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Skor Anda</p>
          <p className="text-5xl font-black text-[#00BFFF] mb-4">{score.toFixed(2)}</p>
          
          <div className="flex justify-center gap-3 text-sm font-medium flex-wrap">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md">
              Benar: {correctCount}
            </div>
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md">
              Salah/Kosong: {wrongOrEmptyCount}
            </div>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md">
              Total Soal: {totalQ}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* --- BAGIAN BAWAH: PEMBAHASAN SOAL --- */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">Pembahasan Soal</h2>
      
      <div className="space-y-4 mb-10">
        {examData.map((qData, index) => {
          const userAns = answers[index];
          const correctAns = qData.answer;
          const isCorrect = userAns === correctAns;
          const isUnanswered = userAns === undefined;

          return (
            // Elemen <details> adalah pengganti st.expander()
            <details 
              key={index} 
              className="group bg-white border border-gray-200 rounded-lg shadow-sm [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="flex items-center gap-3">
                  {/* Ikon Bulat Bulat (Centang Hijau / Silang Merah) */}
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  Soal {index + 1} - {isCorrect ? 'Benar' : 'Salah'}
                </span>
                
                {/* Ikon panah yang akan berputar saat details terbuka */}
                <span className="transition duration-300 group-open:-rotate-180">
                  <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>

              {/* Isi dari expander (Pertanyaan, Jawaban, Penjelasan) */}
              <div className="border-t border-gray-100 p-4 bg-gray-50 text-gray-700">
                <p 
                  className="font-semibold mb-4"
                  dangerouslySetInnerHTML={{ __html: qData.q }}
                />
                
                <div className="mb-4 space-y-2 text-sm border-l-4 border-gray-300 pl-3">
                  <p>
                    Jawaban Anda: {' '}
                    {isUnanswered ? (
                      <span className="font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded">Tidak dijawab</span>
                    ) : (
                      <span className={`font-bold px-2 py-0.5 rounded ${isCorrect ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        {userAns}
                      </span>
                    )}
                  </p>
                  
                  {/* Tampilkan jawaban benar HANYA JIKA jawaban user salah/kosong */}
                  {!isCorrect && (
                    <p>
                      Jawaban Benar: <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{correctAns}</span>
                    </p>
                  )}
                </div>

                {/* Kotak Penjelasan */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-sm">
                  <p className="font-bold text-blue-800 mb-1">Penjelasan:</p>
                  <p 
                    className="text-blue-900 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: qData.explanation || 'Tidak ada penjelasan tersedia.' }}
                  />
                </div>
              </div>
            </details>
          );
        })}
      </div>

      {/* --- TOMBOL KEMBALI --- */}
      <div className="flex justify-center pb-10">
        <button
          onClick={resetApp}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-md transition-colors shadow-md"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
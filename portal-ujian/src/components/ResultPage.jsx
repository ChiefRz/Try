import { useEffect } from 'react';

export default function ResultPage({ examData, answers, resetApp }) {
  // 1. SCROLL KE ATAS SAAT HALAMAN DIMUAT
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 2. DETEKSI SISTEM PENILAIAN & HITUNG SKOR
  const totalQ = examData?.length || 0;
  
  // Deteksi apakah menggunakan skala poin (TKP) atau Benar/Salah biasa
  // Mengecek format opsi pertama pada soal pertama
  const isScaleSystem = totalQ > 0 && typeof examData[0].opts[0] === 'object' && 'score' in examData[0].opts[0];

  let totalScore = 0;
  let maxPossibleScore = 0;
  let answeredCount = 0;
  let correctCount = 0; // Hanya dipakai untuk sistem Benar/Salah

  examData.forEach((qData, index) => {
    const userAns = answers[index];
    if (userAns !== undefined) answeredCount++;

    if (isScaleSystem) {
      // Logika Sistem Poin (TKP)
      const points = userAns?.score || 0;
      totalScore += points;
      
      // Cari nilai maksimal di soal ini (misal poin tertingginya 5)
      const maxInQ = Math.max(...qData.opts.map(o => o.score || 0));
      maxPossibleScore += maxInQ;
    } else {
      // Logika Sistem Benar/Salah Biasa (Fallback)
      maxPossibleScore += 1;
      const userAnsText = typeof userAns === 'object' ? userAns.text : userAns;
      if (userAnsText === qData.answer) {
        correctCount++;
        totalScore += 1;
      }
    }
  });

  // Perhitungan spesifik untuk mode persentase
  const emptyCount = totalQ - answeredCount;
  const wrongCount = answeredCount - correctCount; 
  
  // Nilai Akhir yang ditampilkan (Persentase untuk Benar/Salah, Angka Utuh untuk Poin)
  const finalDisplayScore = isScaleSystem 
    ? totalScore 
    : (totalQ > 0 ? (totalScore / totalQ) * 100 : 0);

  return (
    <div className="animate-fade-in py-6">
      
      {/* --- BAGIAN ATAS: SKOR HASIL --- */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hasil Ujian</h1>
        
        <div className="bg-gray-50 rounded-xl p-6 inline-block w-full max-w-md border border-gray-200 shadow-sm mt-4">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
            {isScaleSystem ? "Total Poin Anda" : "Skor Anda"}
          </p>
          <p className="text-5xl font-black text-[#00BFFF] mb-4">
            {isScaleSystem ? finalDisplayScore : finalDisplayScore.toFixed(2)}
          </p>
          
          <div className="flex justify-center gap-3 text-sm font-medium flex-wrap">
            {isScaleSystem ? (
              <>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                  Terjawab: {answeredCount}/{totalQ}
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md">
                  Poin Maksimal: {maxPossibleScore}
                </div>
                {emptyCount > 0 && (
                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md">
                    Kosong: {emptyCount}
                  </div>
                )}
              </>
            ) : (
              // TAMPILAN SPESIFIK MODE PERSENTASE (BENAR/SALAH/KOSONG)
              <>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md">
                  Benar: {correctCount}
                </div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md">
                  Salah: {wrongCount}
                </div>
                <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">
                  Kosong: {emptyCount}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* --- BAGIAN BAWAH: PEMBAHASAN SOAL --- */}
      <h2 className="text-xl font-bold text-gray-800 mb-6">Detail & Pembahasan</h2>
      
      <div className="space-y-4 mb-10">
        {examData.map((qData, index) => {
          const userAns = answers[index];
          const isUnanswered = userAns === undefined;
          
          // Variabel untuk render
          let iconContent, headerBadge, userAnsText, bgColorIcon;

          if (isScaleSystem) {
            // Setup UI untuk skala poin
            const userPoin = userAns?.score || 0;
            userAnsText = userAns?.text;
            iconContent = isUnanswered ? '-' : userPoin;
            headerBadge = isUnanswered ? 'Tidak Dijawab' : `Poin: ${userPoin}`;
            
            // Pewarnaan indikator berdasar besaran poin (asumsi maks 5)
            if (isUnanswered) bgColorIcon = 'bg-gray-400';
            else if (userPoin === 5) bgColorIcon = 'bg-green-500';
            else if (userPoin >= 3) bgColorIcon = 'bg-blue-500';
            else bgColorIcon = 'bg-orange-500';

          } else {
            // Setup UI untuk sistem benar/salah
            userAnsText = typeof userAns === 'object' ? userAns.text : userAns;
            const isCorrect = userAnsText === qData.answer;
            
            iconContent = isUnanswered ? '-' : (isCorrect ? '✓' : '✗');
            headerBadge = isUnanswered ? 'Tidak Dijawab' : (isCorrect ? 'Benar' : 'Salah');
            bgColorIcon = isUnanswered ? 'bg-gray-400' : (isCorrect ? 'bg-green-500' : 'bg-red-500');
          }

          return (
            <details 
              key={index} 
              className="group bg-white border border-gray-200 rounded-lg shadow-sm [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="flex items-center gap-3">
                  {/* Ikon Indikator */}
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${bgColorIcon}`}>
                    {iconContent}
                  </span>
                  Soal {index + 1} <span className="text-gray-400 font-normal">|</span> {headerBadge}
                </span>
                
                {/* Ikon panah (dropdown) */}
                <span className="transition duration-300 group-open:-rotate-180">
                  <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>

              {/* Isi dari Pembahasan */}
              <div className="border-t border-gray-100 p-4 bg-gray-50 text-gray-700">
                <div 
                  className="font-semibold mb-4 prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: qData.q }}
                />
                
                <div className="mb-4 space-y-2 text-sm border-l-4 border-gray-300 pl-3">
                  <p>
                    Jawaban Anda:{' '}
                    {isUnanswered ? (
                      <span className="font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">Tidak dijawab</span>
                    ) : (
                      <span className={`font-medium px-2 py-1 rounded ${isScaleSystem ? 'text-blue-800 bg-blue-100' : (iconContent === '✓' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100')}`}>
                        {userAnsText}
                      </span>
                    )}
                  </p>
                  
                  {/* Munculkan kunci jawaban HANYA jika ini sistem Benar/Salah dan user salah jawab */}
                  {!isScaleSystem && !isUnanswered && iconContent === '✗' && (
                    <p className="pt-2">
                      Jawaban Benar:{' '}
                      <span className="font-medium text-green-800 bg-green-100 px-2 py-1 rounded">
                        {qData.answer}
                      </span>
                    </p>
                  )}
                </div>

                {/* Kotak Penjelasan */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-sm mt-4">
                  <p className="font-bold text-blue-800 mb-2">Penjelasan Bobot & Aspek:</p>
                  <div 
                    className="text-blue-900 leading-relaxed prose prose-sm max-w-none"
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
import { useEffect } from 'react';

export default function ResultPage({ examData, answers, resetApp }) {
  // 1. SCROLL KE ATAS SAAT HALAMAN DIMUAT
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 2. DETEKSI KATEGORI YANG ADA DI SOAL
  const totalQ = examData?.length || 0;
  
  // Flag penentu apakah sistem passing grade diaktifkan (minimal 30 soal)
  const showPassingGrade = totalQ >= 30;
  
  // Tentukan poin untuk jawaban benar pada TIU/TWK (10 jika < 30 soal, 5 jika >= 30)
  const correctScore = totalQ < 30 ? 10 : 5;
  
  // Mengambil kategori unik yang ada di examData (misal: hanya ['TWK'] atau ['TWK', 'TIU', 'TKP'])
  const presentCategories = Array.from(
    new Set(examData.map((q) => (q.category || '').toUpperCase()))
  ).filter(cat => cat === 'TWK' || cat === 'TIU' || cat === 'TKP');

  // 3. STATE & HITUNG SKOR PER KATEGORI
  let scores = { TWK: 0, TIU: 0, TKP: 0 };
  let answeredCount = 0;
  let maxPossibleScore = 0; // Agar angka maksimal dinamis

  examData.forEach((qData, index) => {
    const userAns = answers[index];
    if (userAns !== undefined) answeredCount++;

    const category = (qData.category || '').toUpperCase();

    if (category === 'TKP') {
      const points = userAns?.score || 0;
      scores.TKP += points;
      
      const maxInQ = Math.max(...(qData.opts || []).map(o => o.score || 0));
      maxPossibleScore += maxInQ;
    } else if (category === 'TWK' || category === 'TIU') {
      // Menggunakan variabel correctScore (10 atau 5)
      maxPossibleScore += correctScore; 
      
      const userAnsText = typeof userAns === 'object' ? userAns.text : userAns;
      if (userAnsText === qData.answer) {
        scores[category] += correctScore;
      }
    }
  });

  const emptyCount = totalQ - answeredCount;
  const totalScore = presentCategories.reduce((total, cat) => total + scores[cat], 0);

  // 4. LOGIKA AMBANG BATAS DINAMIS
  const PASSING_GRADES = { TWK: 65, TIU: 80, TKP: 166 };
  
  // Cek apakah user lulus SEMUA modul yang diujikan
  const isPassedAll = presentCategories.every(cat => scores[cat] >= PASSING_GRADES[cat]);

  // Menentukan layout kolom (grid) berdasarkan jumlah modul yang ada
  const gridLayoutClass = 
    presentCategories.length === 1 ? 'grid-cols-1' :
    presentCategories.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    'grid-cols-1 sm:grid-cols-3';

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      
      {/* --- STICKY HEADER --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm py-4 mb-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <button 
            onClick={resetApp}
            className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2"
            title="Kembali ke Beranda"
          >
            🎓 Uji Coba Tes CPNS
          </button>
        </div>
      </header>

      {/* --- KONTEN UTAMA --- */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* --- BAGIAN ATAS: SKOR HASIL & STATUS KELULUSAN --- */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hasil Ujian</h1>
          
          <div className="bg-gray-50 rounded-xl p-6 inline-block w-full max-w-2xl border border-gray-200 shadow-sm mt-4">
            
            {/* BANNER STATUS KELULUSAN (Hanya Tampil Jika showPassingGrade TRUE) */}
            {showPassingGrade && (
              <div className={`mb-6 py-3 px-4 rounded-lg border-2 font-bold text-lg ${
                isPassedAll 
                  ? 'bg-green-100 border-green-500 text-green-700' 
                  : 'bg-red-100 border-red-500 text-red-700'
              }`}>
                {isPassedAll ? '🎉 LULUS AMBANG BATAS' : 'TIDAK MEMENUHI AMBANG BATAS'}
              </div>
            )}

            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
              Total Skor Anda
            </p>
            <p className="text-5xl font-black text-gray-800 mb-6">
              {totalScore} <span className="text-xl font-medium text-gray-400">/ {maxPossibleScore}</span>
            </p>
            
            {/* RINCIAN NILAI PER MODUL SECARA DINAMIS (Hanya Tampil Jika Modul > 1) */}
            {presentCategories.length > 1 && (
              <div className={`grid gap-4 mb-6 ${gridLayoutClass}`}>
                {presentCategories.map(cat => {
                  const isPass = scores[cat] >= PASSING_GRADES[cat];
                  
                  // Penentuan gaya (style) jika menggunakan passing grade atau tidak
                  const cardBorder = showPassingGrade 
                    ? (isPass ? 'border-green-400' : 'border-red-400') 
                    : 'border-gray-200';
                  
                  const scoreColor = showPassingGrade 
                    ? (isPass ? 'text-green-600' : 'text-red-600') 
                    : 'text-gray-800';

                  return (
                    <div key={cat} className={`bg-white border-2 p-3 rounded-lg shadow-sm ${cardBorder}`}>
                      <p className="text-xs text-gray-500 font-bold mb-1">
                        {cat} {showPassingGrade && `(Min: ${PASSING_GRADES[cat]})`}
                      </p>
                      <p className={`text-3xl font-bold ${scoreColor}`}>
                        {scores[cat]}
                      </p>
                      
                      {/* Label Lulus/Gagal hanya muncul jika syarat totalQ >= 30 terpenuhi */}
                      {showPassingGrade && (
                        <p className={`text-[10px] mt-1 font-semibold uppercase ${isPass ? 'text-green-700' : 'text-red-700'}`}>
                          {isPass ? '✅ Memenuhi' : '❌ Gagal'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* INFO TAMBAHAN: JUMLAH SOAL TERJAWAB */}
            <div className="flex justify-center gap-3 text-sm font-medium flex-wrap">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md border border-blue-200">
                Terjawab: {answeredCount}/{totalQ}
              </div>
              {emptyCount > 0 && (
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-md border border-orange-200">
                  Kosong: {emptyCount}
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* --- BAGIAN BAWAH: PEMBAHASAN SOAL --- */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">Detail & Pembahasan</h2>
        
        <div className="space-y-4 mb-10">
          {examData.map((qData, index) => {
            const userAns = answers[index];
            const isUnanswered = userAns === undefined;
            const category = (qData.category || '').toUpperCase();
            const isTKP = category === 'TKP';
            
            let iconContent, headerBadge, userAnsText, bgColorIcon;

            if (isTKP) {
              const userPoin = userAns?.score || 0;
              userAnsText = userAns?.text;
              iconContent = isUnanswered ? '0' : `+${userPoin}`;
              headerBadge = isUnanswered ? 'Tidak Dijawab' : `Poin: ${userPoin}`;
              
              if (isUnanswered) bgColorIcon = 'bg-gray-400';
              else if (userPoin === 5) bgColorIcon = 'bg-green-500';
              else if (userPoin >= 3) bgColorIcon = 'bg-blue-500';
              else bgColorIcon = 'bg-orange-500';

            } else {
              userAnsText = typeof userAns === 'object' ? userAns.text : userAns;
              const isCorrect = userAnsText === qData.answer;
              
              iconContent = isUnanswered ? '0' : (isCorrect ? `+${correctScore}` : '0');
              headerBadge = isUnanswered ? 'Tidak Dijawab' : (isCorrect ? `Benar (+${correctScore})` : 'Salah (0)');
              bgColorIcon = isUnanswered ? 'bg-gray-400' : (isCorrect ? 'bg-green-500' : 'bg-red-500');
            }

            return (
              <details 
                key={index} 
                className="group bg-white border border-gray-200 rounded-lg shadow-sm [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-inner ${bgColorIcon}`}>
                      {iconContent}
                    </span>
                    <div>
                      {/* TAMPILKAN KATEGORI HANYA JIKA ADA LEBIH DARI 1 KATEGORI DI UJIAN INI */}
                      {presentCategories.length > 1 && (
                        <span className="font-bold text-sm text-blue-600 mr-2">[{category}]</span>
                      )}
                      Soal {index + 1} <span className="text-gray-300 font-normal mx-1">|</span> {headerBadge}
                    </div>
                  </span>
                  
                  <span className="transition-transform duration-300 group-open:-rotate-180 text-gray-400">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>

                <div className="border-t border-gray-100 p-5 bg-gray-50 text-gray-700">
                  <div 
                    className="font-medium mb-5 prose prose-blue max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: qData.q }}
                  />
                  
                  <div className="mb-5 space-y-3 text-sm border-l-4 border-gray-300 pl-4">
                    <p>
                      <span className="text-gray-500 mr-2">Jawaban Anda:</span>
                      {isUnanswered ? (
                        <span className="font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">Tidak dijawab</span>
                      ) : (
                        <span className={`font-medium px-2 py-1 rounded border ${isTKP ? 'text-blue-800 bg-blue-50 border-blue-200' : (iconContent === `+${correctScore}` ? 'text-green-800 bg-green-50 border-green-200' : 'text-red-800 bg-red-50 border-red-200')}`}>
                          {userAnsText}
                        </span>
                      )}
                    </p>
                    
                    {!isTKP && !isUnanswered && iconContent === '0' && (
                      <p>
                        <span className="text-gray-500 mr-2">Jawaban Benar:</span>
                        <span className="font-medium text-green-800 bg-green-50 border border-green-200 px-2 py-1 rounded">
                          {qData.answer}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="font-bold text-blue-800">Penjelasan</p>
                    </div>
                    <div 
                      className="text-blue-900 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: qData.explanation || 'Tidak ada penjelasan yang tersedia untuk soal ini.' }}
                    />
                  </div>
                </div>
              </details>
            );
          })}
        </div>

        {/* --- TOMBOL KEMBALI BAWAH --- */}
        <div className="flex justify-center pb-4">
          <button
            onClick={resetApp}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
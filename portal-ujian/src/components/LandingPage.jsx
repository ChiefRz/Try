import { useState, useEffect } from 'react';

// 1. DATABASE MODUL UJIAN
const examCatalog = [
  { id: "twk_nas_1", type: "TWK", title: "TWK - NASIONALISME 1", desc: "Tes Wawasan Kebangsaan - Nasionalisme 1", file: "twk_nas_1.json", time: 15, q_count: 10 },
  { id: "twk_nas_2", type: "TWK", title: "TWK - NASIONALISME 2", desc: "Tes Wawasan Kebangsaan - Nasionalisme 2", file: "twk_nas_2.json", time: 15, q_count: 10 },
  { id: "twk_int_1", type: "TWK", title: "TWK - INTEGRITAS 1", desc: "Tes Wawasan Kebangsaan - Integritas 1", file: "twk_int_1.json", time: 15, q_count: 10 },
  { id: "twk_int_2", type: "TWK", title: "TWK - INTEGRITAS 2", desc: "Tes Wawasan Kebangsaan - Integritas 2", file: "twk_int_2.json", time: 15, q_count: 10 },
  { id: "twk_bln_1", type: "TWK", title: "TWK - BELA NEGARA 1", desc: "Tes Wawasan Kebangsaan - Bela Negara 1", file: "twk_bln_1.json", time: 15, q_count: 10 },
  { id: "twk_bln_2", type: "TWK", title: "TWK - BELA NEGARA 2", desc: "Tes Wawasan Kebangsaan - Bela Negara 2", file: "twk_bln_2.json", time: 15, q_count: 10 },
  { id: "twk_pnr_1", type: "TWK", title: "TWK - PILAR NEGARA 1", desc: "Tes Wawasan Kebangsaan - Pilar Negara 1", file: "twk_pnr_1.json", time: 15, q_count: 10 },
  { id: "twk_pnr_2", type: "TWK", title: "TWK - PILAR NEGARA 2", desc: "Tes Wawasan Kebangsaan - Pilar Negara 2", file: "twk_pnr_2.json", time: 15, q_count: 10 },
  { id: "twk_bhs_1", type: "TWK", title: "TWK - BAHASA INDONESIA 1", desc: "Tes Wawasan Kebangsaan - Bahasa Indonesia 1", file: "twk_bhs_1.json", time: 15, q_count: 10 },
  { id: "twk_bhs_2", type: "TWK", title: "TWK - BAHASA INDONESIA 2", desc: "Tes Wawasan Kebangsaan - Bahasa Indonesia 2", file: "twk_bhs_2.json", time: 15, q_count: 10 },
  { id: "twk_cmr_1", type: "TWK", title: "TWK - CAMPURAN 1", desc: "Tes Wawasan Kebangsaan - Campuran 1", file: "twk_cmr_1.json", time: 35, q_count: 30 },
  { id: "tiu_ana_1", type: "TIU", title: "TIU - ANALOGI 1", desc: "Tes Intelegensia Umum - Analogi 1", file: "tiu_ana_1.json", time: 15, q_count: 10 },
  { id: "tiu_ana_2", type: "TIU", title: "TIU - ANALOGI 2", desc: "Tes Intelegensia Umum - Analogi 2", file: "tiu_ana_2.json", time: 15, q_count: 10 },
  { id: "tiu_sil_1", type: "TIU", title: "TIU - SILOGISME 1", desc: "Tes Intelegensia Umum - Silogisme 1", file: "tiu_sil_1.json", time: 15, q_count: 10 },
  { id: "tiu_sil_2", type: "TIU", title: "TIU - SILOGISME 2", desc: "Tes Intelegensia Umum - Silogisme 2", file: "tiu_sil_2.json", time: 15, q_count: 10 },
  { id: "tiu_der_1", type: "TIU", title: "TIU - DERET ANGKA 1", desc: "Tes Intelegensia Umum - Deret Angka 1", file: "tiu_der_1.json", time: 15, q_count: 10 },
  { id: "tiu_der_2", type: "TIU", title: "TIU - DERET ANGKA 2", desc: "Tes Intelegensia Umum - Deret Angka 2", file: "tiu_der_2.json", time: 15, q_count: 10 },
  { id: "tkp_plb_1", type: "TKP", title: "TKP - PELAYANAN PUBLIK 1", desc: "Tes Karakteristik Pribadi - Pelayanan Publik 1", file: "tkp_plb_1.json", time: 15, q_count: 10 },
  { id: "tkp_jjk_1", type: "TKP", title: "TKP - JEJARING KERJA 1", desc: "Tes Karakteristik Pribadi - Jejaring Kerja 1", file: "tkp_jjk_1.json", time: 15, q_count: 10 },
  { id: "tkp_sbd_1", type: "TKP", title: "TKP - SOSIAL BUDAYA 1", desc: "Tes Karakteristik Pribadi - Sosial Budaya 1", file: "tkp_sbd_1.json", time: 15, q_count: 10 },
  { id: "tkp_tik_1", type: "TKP", title: "TKP - TEKNOLOGI INFORMASI 1", desc: "Tes Karakteristik Pribadi - Teknologi Informasi 1", file: "tkp_tik_1.json", time: 15, q_count: 10 },
];

export default function LandingPage({ startExam }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // 3. LOGIKA FILTERING
  const filteredExams = examCatalog.filter(exam => 
    selectedCategory === "Semua" || exam.type === selectedCategory
  );

  return (
    <div className="animate-fade-in">
      {/* --- HEADER --- */}
      <div className="border-b-2 border-gray-100 pb-4 mb-6 mt-4">
        <h4 className="text-xl font-semibold text-gray-700">🎓 Uji Coba Tes CPNS</h4>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Selamat Datang.</h1>
      <p className="text-gray-600 mb-8">Silakan pilih modul ujian yang tersedia di bawah ini.</p>

      {/* --- KOMPONEN FILTER --- */}
      <div className="mb-8 max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Kategori Ujian:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm border p-2.5 focus:border-[#00BFFF] focus:ring-[#00BFFF] bg-white text-gray-700 outline-none transition-colors"
        >
          <option value="Semua">Semua</option>
          <option value="TWK">TWK</option>
          <option value="TIU">TIU</option>
          <option value="TKP">TKP</option>
        </select>
      </div>

      {/* --- RENDER UI GRID --- */}
      {filteredExams.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
          <p className="text-blue-700">
            Belum ada modul ujian yang tersedia untuk kategori <span className="font-bold">{selectedCategory}</span> saat ini.
          </p>
        </div>
      ) : (
        // Grid CSS Tailwind: 1 kolom di HP, 2 kolom di tablet, 4 kolom di PC
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredExams.map((exam) => (
            <div 
              key={exam.id} 
              className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 text-lg leading-tight mb-3">
                  {exam.title}
                </h3>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>⏱️ {exam.time} Menit</p>
                  <p>📝 {exam.q_count} Soal</p>
                </div>
              </div>
              
              <button
                onClick={() => startExam(exam.file, exam.title, exam.time)}
                className="w-full bg-[#00BFFF] hover:bg-[#1E90FF] text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Mulai Ujian
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React from 'react';

const UserInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8 animate-fade-in">
        
        {/* Tentang Aplikasi */}
        <section>
          <h1 className="text-3xl font-bold text-slate-800 mb-4 border-b pb-2">Info</h1>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Tentang Aplikasi</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Aplikasi ini dikembangkan untuk memenuhi kebutuhan <strong>Proyek Akhir Mata Kuliah Matematika Diskrit</strong>.
          </p>
        </section>

        {/* Informasi Proyek */}
        <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
           <h2 className="text-xl font-bold text-slate-800 mb-4">Informasi Proyek</h2>
           <div className="text-slate-700 space-y-1">
             <p className="font-medium">Program Studi Informatika</p>
             <p>Fakultas Sains dan Teknologi</p>
             <p className="font-bold text-blue-800">Universitas Jambi</p>
           </div>
        </section>

        {/* Pengembang */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
           <div className="bg-blue-600 px-6 py-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
               Pengembang
             </h2>
           </div>
           <div className="p-6 space-y-3">
             <div className="flex flex-col sm:flex-row sm:items-center border-b border-slate-100 pb-2">
               <span className="w-32 text-slate-500 text-sm uppercase tracking-wider font-semibold">Nama</span>
               <span className="font-bold text-lg text-slate-800">M. Akmal Faizhin Hafiz</span>
             </div>
             <div className="flex flex-col sm:flex-row sm:items-center border-b border-slate-100 pb-2">
               <span className="w-32 text-slate-500 text-sm uppercase tracking-wider font-semibold">NIM</span>
               <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">F1E125073</span>
             </div>
             <div className="flex flex-col sm:flex-row sm:items-center">
               <span className="w-32 text-slate-500 text-sm uppercase tracking-wider font-semibold">Angkatan</span>
               <span className="text-slate-700 font-medium">2025</span>
             </div>
           </div>
        </section>

        {/* Dukungan AI */}
        <section>
           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
             Dukungan Pengembangan AI
           </h2>
           <p className="text-slate-600 mb-4">
             Pengerjaan aplikasi ini sangat terbantu oleh kolaborasi dengan model bahasa besar (Large Language Models) dari Google:
           </p>
           
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm flex flex-col md:flex-row gap-4 items-start">
              <div className="bg-white p-3 rounded-full shadow-md shrink-0">
                {/* Google Gemini / Sparkle Icon */}
                <svg className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2L14.39 8.26L20.66 10.66L14.39 13.06L12 19.33L9.61 13.06L3.34 10.66L9.61 8.26L12 2Z" stroke="url(#grad1)" strokeWidth="0" fill="url(#grad1)"/>
                   <defs>
                     <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" style={{stopColor:'#4285F4', stopOpacity:1}} />
                       <stop offset="100%" style={{stopColor:'#DB4437', stopOpacity:1}} />
                     </linearGradient>
                   </defs>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Gemini AI 3.0 Pro</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Model-model AI ini digunakan untuk membantu dalam proses <em>debugging</em>, perbaikan kode, penambahan fitur, dan perancangan struktur aplikasi, memastikan kode yang dihasilkan efisien dan sesuai dengan praktik terbaik modern.
                </p>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default UserInfo;
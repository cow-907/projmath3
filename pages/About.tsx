import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Tentang Aplikasi</h1>
        
        <div className="prose prose-blue max-w-none text-slate-600">
          <p className="text-lg mb-4">
            Aplikasi <strong>OjekFinder Mendalo</strong> adalah sebuah simulasi implementasi algoritma 
            <span className="font-mono bg-yellow-100 px-1 mx-1 rounded text-yellow-800">Dijkstra</span>
            untuk mencari driver ojek terdekat di kawasan <strong>Mendalo Darat, Muaro Jambi</strong>.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-2">Lokasi Simulasi</h3>
          <p>
            Peta digital yang ditampilkan merepresentasikan titik-titik penting di sekitar Mendalo, antara lain:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Universitas Jambi (UNJA)</strong></li>
            <li><strong>UIN Sulthan Thaha Saifuddin</strong></li>
            <li><strong>CitraRaya City</strong></li>
            <li><strong>Pasar Mendalo</strong> & Simpang Rimbo</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-2">Cara Kerja</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Node (Titik) dalam peta merepresentasikan pangkalan ojek atau lokasi penjemputan penumpang.</li>
            <li>Garis penghubung merepresentasikan Jalan Lintas Sumatera (Jalan Jambi - Ma. Bulian) dan jalan akses kampus/perumahan.</li>
            <li>Algoritma menghitung jarak terpendek dari setiap driver ke posisi penumpang yang dipilih.</li>
          </ul>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-2">Teknologi</h3>
          <p>
            Website ini dibangun menggunakan <strong>React</strong> dan <strong>TypeScript</strong> dengan styling <strong>Tailwind CSS</strong>.
            Visualisasi peta menggunakan SVG dinamis yang dirender secara <em>real-time</em> di browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
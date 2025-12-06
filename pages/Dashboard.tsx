
import React, { useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/graphData';
import { findNearestDriver } from '../utils/dijkstra';
import MapVisualizer from '../components/MapVisualizer';
import { DijkstraResult, Node, Edge } from '../types';

const Dashboard: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [result, setResult] = useState<DijkstraResult>({ 
    path: [], 
    distance: 0, 
    targetDriverId: null,
    visitOrder: [],
    allDistances: {},
    steps: []
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const users = INITIAL_DATA.nodes.filter(n => n.type === 'user');

  const handleUserSelect = (id: string) => {
    setSelectedUserId(id);
    setIsCalculating(true);
    setResult({ 
      path: [], 
      distance: 0, 
      targetDriverId: null,
      visitOrder: [],
      allDistances: {},
      steps: []
    });
  };

  const handleReset = () => {
    setSelectedUserId(null);
    setResult({ 
      path: [], 
      distance: 0, 
      targetDriverId: null,
      visitOrder: [],
      allDistances: {},
      steps: []
    });
    setIsCalculating(false);
  };

  useEffect(() => {
    if (selectedUserId && isCalculating) {
      // Simulate calculation delay for effect
      const timer = setTimeout(() => {
        const res = findNearestDriver(INITIAL_DATA, selectedUserId);
        setResult(res);
        setIsCalculating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [selectedUserId, isCalculating]);

  const selectedUserNode = users.find(u => u.id === selectedUserId);
  const foundDriverNode = INITIAL_DATA.nodes.find(n => n.id === result.targetDriverId);

  // Helper to get node label by ID
  const getNodeLabel = (id: string) => INITIAL_DATA.nodes.find(n => n.id === id)?.label || id;
  const getNodeType = (id: string) => INITIAL_DATA.nodes.find(n => n.id === id)?.type || 'unknown';

  // Helper to get edges specific to the result path
  const getPathEdges = (): Edge[] => {
    if (result.path.length < 2) return [];
    const pathEdges: Edge[] = [];
    for (let i = 0; i < result.path.length - 1; i++) {
      const source = result.path[i];
      const target = result.path[i+1];
      // Find the edge in data
      const edge = INITIAL_DATA.edges.find(
        e => (e.source === source && e.target === target) || (e.source === target && e.target === source)
      );
      if (edge) {
        // Ensure displayed direction matches path direction for clarity, though graph is undirected
        pathEdges.push({ ...edge, source, target }); 
      }
    }
    return pathEdges;
  };

  const pathEdges = getPathEdges();

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
      {/* Left Panel: Controls - Fixed Sidebar */}
      <aside className="w-full lg:w-1/3 p-6 flex flex-col gap-6 border-r border-slate-200 bg-white z-10 overflow-y-auto h-full shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Ojek Mendalo Jambi</h1>
          <p className="text-slate-500 text-sm">
            Simulasi pencarian driver terdekat di kawasan <strong>Mendalo Darat, Jambi</strong> menggunakan algoritma Dijkstra.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pilih Lokasi Penjemputan</h2>
          <div className="grid gap-3">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                className={`flex items-center p-3 rounded-xl border transition-all duration-200 group text-left ${
                  selectedUserId === user.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-md'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <img 
                  src={user.avatar} 
                  alt={user.label} 
                  className="w-10 h-10 rounded-full mr-4 border border-slate-300 group-hover:scale-105 transition-transform" 
                />
                <div>
                  <div className={`font-semibold ${selectedUserId === user.id ? 'text-blue-800' : 'text-slate-700'}`}>
                    {user.label}
                  </div>
                  <div className="text-xs text-slate-500">Koordinat: ({user.x}, {user.y})</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-auto bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex justify-between items-center mb-3 border-b border-slate-200 pb-2">
            <h3 className="font-semibold text-slate-800">Status Pencarian</h3>
            {selectedUserId && (
              <button 
                onClick={handleReset}
                className="text-xs flex items-center gap-1 bg-white border border-slate-300 text-slate-600 px-2 py-1 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Maps
              </button>
            )}
          </div>
          
          {!selectedUserId && (
            <div className="text-center py-4 text-slate-400 text-sm">
              Silakan pilih pengguna/lokasi penjemputan di atas.
            </div>
          )}

          {isCalculating && (
            <div className="flex items-center justify-center py-4 gap-2 text-blue-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Mencari driver di sekitar Mendalo...</span>
            </div>
          )}

          {!isCalculating && selectedUserId && result.targetDriverId && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Driver Ditemukan:</span>
                <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                  {foundDriverNode?.label}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Jarak Tempuh:</span>
                <span className="font-mono font-medium">{result.distance.toFixed(1)} meter (est)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Rute Node:</span>
                 <span className="text-xs text-slate-700 font-mono max-w-[60%] text-right truncate">
                   {result.path.join(' → ')}
                 </span>
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 rounded-lg text-xs text-blue-800 flex gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                 </svg>
                 <p>Sistem telah menemukan ojek tercepat dari posisinya menuju lokasi penjemputan.</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Right Panel: Map & Tables - Scrollable */}
      <main className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          
          {/* Map Container */}
          <div className="h-[500px] w-full shadow-xl rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0">
            <MapVisualizer 
              data={INITIAL_DATA}
              activePath={result.path}
              selectedUserId={selectedUserId}
              nearestDriverId={result.targetDriverId}
            />
          </div>

          {/* Tables Section (Visible only after selection) */}
          {selectedUserId && !isCalculating && (
            <div className="grid gap-6 pb-6">
              
              {/* Table 1: Detailed Iteration Logs (Requested Format) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Tabel Detail Iterasi Algoritma Dijkstra
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Proses pencarian jalur terpendek langkah demi langkah.
                  </p>
                </div>
                <div className="overflow-x-auto max-h-[400px]">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap w-16 text-center">Iterasi</th>
                        <th className="px-4 py-3 whitespace-nowrap w-32 border-l border-slate-100">Node Diproses</th>
                        <th className="px-4 py-3 min-w-[200px] border-l border-slate-100">Node Belum Dikunjungi (Unvisited)</th>
                        <th className="px-4 py-3 min-w-[200px] border-l border-slate-100">Node Sudah Dikunjungi (Visited)</th>
                        <th className="px-4 py-3 min-w-[250px] border-l border-slate-100">Pembaruan Jarak (Updates)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.steps.map((step) => (
                        <tr key={step.iteration} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-center font-mono text-slate-500 font-bold bg-slate-50/50">
                            {step.iteration}
                          </td>
                          <td className="px-4 py-3 border-l border-slate-100">
                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs border border-blue-100">
                              {step.currentNodeId}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-l border-slate-100">
                            <div className="flex flex-wrap gap-1 max-w-[250px]">
                              {step.unvisited.map(id => (
                                <span key={id} className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">{id}</span>
                              ))}
                              {step.unvisited.length === 0 && <span className="text-xs text-slate-300 italic">None</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-l border-slate-100">
                            <div className="flex flex-wrap gap-1 max-w-[250px]">
                              {step.visited.map(id => (
                                <span key={id} className="text-[10px] text-green-600 bg-green-50 px-1 rounded border border-green-100">{id}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-l border-slate-100">
                            <ul className="text-xs space-y-1">
                              {step.updates.map((update, i) => (
                                <li key={i} className="flex items-center gap-1.5 text-slate-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0"></span>
                                  {update}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: Connections (Edges) - Filtered to Path */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Detail Rute Terpilih (Hasil Akhir)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Segmen jalan yang harus dilalui driver <strong>{foundDriverNode?.label}</strong> untuk mencapai user.
                  </p>
                </div>
                <div className="overflow-x-auto max-h-[300px]">
                  {pathEdges.length > 0 ? (
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3">Dari Node</th>
                          <th className="px-4 py-3">Ke Node</th>
                          <th className="px-4 py-3 text-right">Jarak Segmen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pathEdges.map((edge, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">
                              <span className="font-medium">{getNodeLabel(edge.source)}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              <span className="font-medium">{getNodeLabel(edge.target)}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-slate-500">
                              {edge.weight.toFixed(1)} m
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-bold text-slate-700">
                          <td colSpan={2} className="px-4 py-3 text-right">Total Jarak:</td>
                          <td className="px-4 py-3 text-right">{result.distance.toFixed(1)} m</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-400 italic">
                      Tidak ada rute yang terbentuk.
                    </div>
                  )}
                </div>
              </div>

              {/* Explanations Section */}
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                
                {/* How it Works */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Bagaimana Cara Kerjanya?
                  </h3>
                  <div className="prose prose-sm text-slate-600 space-y-3">
                    <p>
                      Algoritma Dijkstra bekerja dengan cara mengeksplorasi graf secara bertahap dari titik awal (User) ke seluruh titik lain di peta.
                    </p>
                    <ol className="list-decimal pl-4 space-y-2 marker:text-blue-500 font-medium text-slate-700">
                      <li>
                        <span className="font-bold text-slate-900">Inisialisasi:</span> Jarak ke titik awal di-set ke 0, dan jarak ke semua titik lain adalah tak hingga (∞).
                      </li>
                      <li>
                        <span className="font-bold text-slate-900">Pilih Node Terdekat:</span> Algoritma memilih node yang belum dikunjungi dengan estimasi jarak terpendek saat ini.
                      </li>
                      <li>
                        <span className="font-bold text-slate-900">Relaksasi (Update):</span> Untuk node terpilih, cek semua tetangga. Jika jalur melalui node ini lebih pendek, update nilai jarak tetangga tersebut.
                      </li>
                      <li>
                        <span className="font-bold text-slate-900">Ulangi:</span> Proses ini diulang hingga target ditemukan atau semua node terjangkau telah diproses.
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Recommendation Logic */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Logika Penentuan Rekomendasi
                  </h3>
                  <div className="prose prose-sm text-slate-600 space-y-3">
                    <p>
                      Sistem menggunakan hasil perhitungan Dijkstra untuk merekomendasikan driver terbaik dengan logika berikut:
                    </p>
                    <ul className="list-disc pl-4 space-y-2 marker:text-green-500">
                      <li>
                        Titik <strong>User</strong> dianggap sebagai <em>Source Node</em> (titik awal).
                      </li>
                      <li>
                        Algoritma dijalankan hingga menghitung jarak terpendek ke <strong>SEMUA</strong> node dalam jaringan jalan.
                      </li>
                      <li>
                        Sistem memfilter node yang bertipe <strong>Driver</strong> dan membandingkan jarak akhirnya.
                      </li>
                      <li>
                        Driver dengan <strong>Total Jarak Terkecil</strong> dipilih sebagai pemenang.
                      </li>
                      <li>
                        Rute perjalanan kemudian dibentuk dengan menelusuri balik (backtracking) dari posisi Driver ke User.
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

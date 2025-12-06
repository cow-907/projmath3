import { GraphData, Node, Edge } from '../types';

// Helper to calculate Euclidean distance for edge weight
const dist = (n1: Node, n2: Node) => {
  return Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
};

// Map of Mendalo Darat, Jambi
// Main Road (Jalan Jambi - Muara Bulian) runs roughly East-West (Right-Left)
const nodes: Node[] = [
  // Users (Red nodes)
  { id: 'U1', x: 200, y: 380, type: 'user', label: 'Mahasiswa UNJA', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 'U2', x: 550, y: 220, type: 'user', label: 'Mahasiswa UIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: 'U3', x: 400, y: 120, type: 'user', label: 'Warga Mendalo Asri', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grandma' },

  // Drivers (Green nodes)
  { id: 'D1', x: 750, y: 280, type: 'driver', label: 'Ojek Simpang Rimbo' },
  { id: 'D2', x: 600, y: 320, type: 'driver', label: 'Ojek Depan UIN' },
  { id: 'D3', x: 500, y: 280, type: 'driver', label: 'Ojek Pasar Mendalo' },
  { id: 'D4', x: 350, y: 320, type: 'driver', label: 'Ojek CitraRaya' },
  { id: 'D5', x: 220, y: 280, type: 'driver', label: 'Ojek Gerbang UNJA' },
  { id: 'D6', x: 50, y: 300, type: 'driver', label: 'Ojek Batas Kota' },
  { id: 'D7', x: 400, y: 450, type: 'driver', label: 'Ojek Perumahan' },
  { id: 'D8', x: 150, y: 150, type: 'driver', label: 'Ojek Pematang Sulur' },

  // Intersections/Landmarks (Mendalo Area)
  { id: 'I1', x: 750, y: 300, type: 'intersection', label: 'Simpang Rimbo' },
  { id: 'I2', x: 550, y: 300, type: 'intersection', label: 'Gerbang UIN' },
  { id: 'I3', x: 400, y: 300, type: 'intersection', label: 'Pasar Mendalo' },
  { id: 'I4', x: 200, y: 300, type: 'intersection', label: 'Gerbang UNJA' },
  { id: 'I5', x: 50, y: 300, type: 'intersection', label: 'CitraRaya City' },
  
  // Branch Roads
  { id: 'I6', x: 400, y: 150, type: 'intersection', label: 'Mendalo Asri' }, // North of Pasar
  { id: 'I7', x: 200, y: 450, type: 'intersection', label: 'Jalan Lingkar' }, // South of UNJA
  { id: 'I8', x: 550, y: 220, type: 'intersection', label: 'Dalam Kampus UIN' }, // Inside UIN
  { id: 'I9', x: 200, y: 380, type: 'intersection', label: 'Dalam Kampus UNJA' }, // Inside UNJA
];

// Define connections (Roads)
const getNode = (id: string) => nodes.find(n => n.id === id)!;

const rawConnections = [
  // Main Road (Jalan Jambi - Muara Bulian)
  ['I1', 'I2'], // Sp. Rimbo - UIN
  ['I2', 'I3'], // UIN - Pasar
  ['I3', 'I4'], // Pasar - UNJA
  ['I4', 'I5'], // UNJA - CitraRaya

  // Branches
  ['I3', 'I6'], // Pasar - Mendalo Asri
  ['I4', 'I7'], // UNJA - Jalan Lingkar
  ['I2', 'I8'], // UIN Gate - Inside UIN
  ['I4', 'I9'], // UNJA Gate - Inside UNJA

  // User Connections
  ['U1', 'I9'], // User 1 at Inside UNJA
  ['U2', 'I8'], // User 2 at Inside UIN
  ['U3', 'I6'], // User 3 at Mendalo Asri

  // Driver Connections (Spotting locations)
  ['D1', 'I1'],
  ['D2', 'I2'],
  ['D3', 'I3'],
  ['D4', 'I3'], // Between Pasar & UNJA
  ['D4', 'I4'],
  ['D5', 'I4'],
  ['D6', 'I5'],
  ['D7', 'I7'],
  ['D7', 'I3'], // Shortcut
  ['D8', 'I5'], // Far west shortcut
  ['D8', 'I6'],
];

const edges: Edge[] = rawConnections.map(([src, tgt]) => {
  const n1 = getNode(src);
  const n2 = getNode(tgt);
  return {
    source: src,
    target: tgt,
    weight: dist(n1, n2),
  };
});

export const INITIAL_DATA: GraphData = { nodes, edges };
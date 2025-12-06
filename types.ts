
export type NodeType = 'user' | 'driver' | 'intersection';

export interface Node {
  id: string;
  x: number;
  y: number;
  type: NodeType;
  label: string;
  avatar?: string; // URL for image
}

export interface Edge {
  source: string;
  target: string;
  weight: number; // Represents distance/cost
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface DijkstraStep {
  iteration: number;
  currentNodeId: string;
  unvisited: string[];
  visited: string[];
  updates: string[]; // Description of updates: "Node X: old -> new via Y"
  distances: Record<string, number>; // Snapshot of distances
  previous: Record<string, string | null>; // Snapshot of previous nodes
}

export interface DijkstraResult {
  path: string[]; // Array of Node IDs
  distance: number;
  targetDriverId: string | null;
  visitOrder: string[]; // Array of Node IDs in order of visitation
  allDistances: Record<string, number>; // Distance from source to every node
  steps: DijkstraStep[]; // Detailed log of iterations
}

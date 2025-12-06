
import { GraphData, DijkstraResult, Node, DijkstraStep } from '../types';

export const findNearestDriver = (
  graph: GraphData,
  startNodeId: string
): DijkstraResult => {
  const { nodes, edges } = graph;
  
  // 1. Initialize distances and priority queue
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited: Set<string> = new Set();
  const visited: string[] = [];
  const steps: DijkstraStep[] = [];

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  distances[startNodeId] = 0;

  let iterationCount = 1;

  // 2. Dijkstra's Loop
  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentNodeId: string | null = null;
    let minDist = Infinity;

    unvisited.forEach(id => {
      if (distances[id] < minDist) {
        minDist = distances[id];
        currentNodeId = id;
      }
    });

    // If we can't reach any more nodes or finished
    if (currentNodeId === null || minDist === Infinity) break;

    // Snapshot before processing updates (but after selecting node)
    const currentUnvisitedList = Array.from(unvisited).filter(id => id !== currentNodeId);
    
    unvisited.delete(currentNodeId);
    visited.push(currentNodeId);

    // Get neighbors
    const neighbors = edges.filter(e => e.source === currentNodeId || e.target === currentNodeId);
    const updates: string[] = [];

    for (const edge of neighbors) {
      const neighborId = edge.source === currentNodeId ? edge.target : edge.source;
      if (!unvisited.has(neighborId)) continue;

      const alt = distances[currentNodeId] + edge.weight;
      if (alt < distances[neighborId]) {
        const oldDist = distances[neighborId];
        distances[neighborId] = alt;
        previous[neighborId] = currentNodeId;
        updates.push(`${neighborId}: ${oldDist === Infinity ? '∞' : oldDist.toFixed(0)} → ${alt.toFixed(0)} (via ${currentNodeId})`);
      }
    }

    // Record step
    steps.push({
      iteration: iterationCount++,
      currentNodeId: currentNodeId,
      unvisited: currentUnvisitedList, 
      visited: [...visited],
      updates: updates.length > 0 ? updates : ['-'],
      distances: { ...distances },
      previous: { ...previous }
    });
  }

  // 3. Find the nearest Driver
  let nearestDriverId: string | null = null;
  let minDriverDist = Infinity;

  const driverNodes = nodes.filter(n => n.type === 'driver');
  
  driverNodes.forEach(driver => {
    if (distances[driver.id] < minDriverDist) {
      minDriverDist = distances[driver.id];
      nearestDriverId = driver.id;
    }
  });

  if (!nearestDriverId) {
    return { 
      path: [], 
      distance: 0, 
      targetDriverId: null,
      visitOrder: visited,
      allDistances: distances,
      steps
    };
  }

  // 4. Reconstruct Path
  const path: string[] = [];
  let u: string | null = nearestDriverId;
  if (previous[u] !== null || u === startNodeId) {
    while (u) {
      path.unshift(u);
      u = previous[u];
    }
  }

  return {
    path,
    distance: minDriverDist,
    targetDriverId: nearestDriverId,
    visitOrder: visited,
    allDistances: distances,
    steps
  };
};

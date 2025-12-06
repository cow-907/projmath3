
import React from 'react';
import { GraphData, Node, Edge } from '../types';

interface MapVisualizerProps {
  data: GraphData;
  activePath: string[];
  selectedUserId: string | null;
  nearestDriverId: string | null;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({ 
  data, 
  activePath, 
  selectedUserId,
  nearestDriverId 
}) => {
  const { nodes, edges } = data;

  // Helper to check if edge is part of the active path
  const isEdgeActive = (edge: Edge) => {
    if (activePath.length < 2) return false;
    for (let i = 0; i < activePath.length - 1; i++) {
      if (
        (activePath[i] === edge.source && activePath[i + 1] === edge.target) ||
        (activePath[i] === edge.target && activePath[i + 1] === edge.source)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="w-full h-full bg-[#eef2f6] rounded-xl border-2 border-slate-300 overflow-hidden relative shadow-inner">
      {/* Background Grid Pattern to look like a map */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>

      {/* Signal Animation Styles */}
      <style>{`
        @keyframes signal-ripple {
          0% {
            transform: scale(1);
            opacity: 0.7;
            stroke-width: 2px;
          }
          100% {
            transform: scale(25);
            opacity: 0;
            stroke-width: 0px;
          }
        }
        .signal-wave {
          transform-origin: center;
          animation: signal-ripple 3s linear infinite;
          pointer-events: none;
        }
      `}</style>

      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-full relative z-10" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {/* 1. LAYER 1: Render ALL routes (Road Network) first */}
        {edges.map((edge, idx) => {
          const n1 = nodes.find(n => n.id === edge.source)!;
          const n2 = nodes.find(n => n.id === edge.target)!;
          
          return (
            <g key={`road-bg-${idx}`}>
              {/* Road Border */}
              <line
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="#94a3b8" // Visible Slate 400
                strokeWidth={8}
                strokeLinecap="round"
              />
              {/* Road Center */}
              <line
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="#f8fafc" // White/Slate 50
                strokeWidth={4}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* 2. LAYER 2: Render SELECTED Route on top */}
        {edges.map((edge, idx) => {
          const active = isEdgeActive(edge);
          if (!active) return null;

          const n1 = nodes.find(n => n.id === edge.source)!;
          const n2 = nodes.find(n => n.id === edge.target)!;

          return (
            <g key={`road-active-${idx}`}>
              {/* Active Road Border */}
              <line
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="#2563eb" // Blue 600
                strokeWidth={10}
                strokeLinecap="round"
                className="transition-colors duration-500"
              />
              {/* Active Road Center */}
              <line
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke="#93c5fd" // Blue 300
                strokeWidth={6}
                strokeLinecap="round"
                className="transition-colors duration-500"
              />
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedUserId;
          const isNearest = node.id === nearestDriverId;
          
          // Render logic based on type
          if (node.type === 'intersection') {
            return (
              <g key={node.id}>
                 <circle cx={node.x} cy={node.y} r={4} fill="#64748b" />
                 {node.label && (
                   <text x={node.x} y={node.y + 15} textAnchor="middle" className="text-[10px] fill-slate-500 font-semibold opacity-70">
                     {node.label}
                   </text>
                 )}
              </g>
            );
          }

          const isUser = node.type === 'user';
          
          return (
            <React.Fragment key={node.id}>
              
              {/* Signal Animation (Ripples) - Rendered underneath the node */}
              {(isSelected || isNearest) && (
                <g transform={`translate(${node.x}, ${node.y})`}>
                  <circle 
                    r={10} 
                    fill="none" 
                    stroke={isSelected ? '#3b82f6' : '#22c55e'} 
                    className="signal-wave"
                    style={{ animationDelay: '0s' }}
                  />
                  <circle 
                    r={10} 
                    fill="none" 
                    stroke={isSelected ? '#3b82f6' : '#22c55e'} 
                    className="signal-wave"
                    style={{ animationDelay: '1s' }}
                  />
                  <circle 
                    r={10} 
                    fill="none" 
                    stroke={isSelected ? '#3b82f6' : '#22c55e'} 
                    className="signal-wave"
                    style={{ animationDelay: '2s' }}
                  />
                </g>
              )}

              <g className="cursor-pointer transition-transform duration-300 hover:scale-110" 
                 style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
                
                {/* Background Bubble */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={isUser ? '#ef4444' : '#84cc16'}
                  stroke="white"
                  strokeWidth="2"
                  filter="url(#dropShadow)"
                />

                {/* Icon */}
                <g transform={`translate(${node.x - 10}, ${node.y - 10}) scale(0.8)`}>
                  {isUser ? (
                    // User Icon (Person)
                    <path 
                      fill="white" 
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  ) : (
                    // Driver Icon (Motorcycle)
                    <path 
                      fill="white" 
                      d="M19.44 9.03L15.41 5H11v2h3.55l2.29 2.29-3.12 3.12-2.5-3.32-3.83-2.68C7.17 6.27 6.94 6.18 6.7 6.18H5v2h1.6l2.35 1.64.91 1.21-1.35.9-2.26-1.51-1.11 1.66 2.65 1.77c.43.29.98.3 1.43.03l2.45-1.46 2.37 3.16c-.73.4-1.28 1.09-1.48 1.92H6v2h6.29c.35 1.25 1.49 2.18 2.85 2.18 1.66 0 3-1.34 3-3s-1.34-3-3-3c-.63 0-1.21.2-1.7.54l-2.02-2.69 2.88-2.88c.28.66.86 1.18 1.57 1.35.48.11.96.06 1.41-.12.45-.18.82-.49 1.07-.88l1.66 1.11 1.11-1.66-1.68-1.12zM15.14 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
                    />
                  )}
                </g>

                {/* Label */}
                <rect x={node.x - 40} y={node.y - 38} width="80" height="16" rx="4" fill="white" opacity="0.9" />
                <text
                  x={node.x}
                  y={node.y - 27}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-800 pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            </React.Fragment>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 p-3 rounded-lg shadow-md text-xs backdrop-blur-sm border border-slate-200 z-20">
        <div className="font-bold text-slate-700 mb-2">Legenda Peta</div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
             <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <span>Pengguna (User)</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center">
             <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.44 9.03L15.41 5H11v2h3.55l2.29 2.29-3.12 3.12-2.5-3.32-3.83-2.68C7.17 6.27 6.94 6.18 6.7 6.18H5v2h1.6l2.35 1.64.91 1.21-1.35.9-2.26-1.51-1.11 1.66 2.65 1.77c.43.29.98.3 1.43.03l2.45-1.46 2.37 3.16c-.73.4-1.28 1.09-1.48 1.92H6v2h6.29c.35 1.25 1.49 2.18 2.85 2.18 1.66 0 3-1.34 3-3s-1.34-3-3-3c-.63 0-1.21.2-1.7.54l-2.02-2.69 2.88-2.88c.28.66.86 1.18 1.57 1.35.48.11.96.06 1.41-.12.45-.18.82-.49 1.07-.88l1.66 1.11 1.11-1.66-1.68-1.12zM15.14 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
          </div>
          <span>Driver Ojek</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-1 bg-blue-600 rounded-full"></div>
          <span>Jalur Terpilih</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-1 bg-slate-400 rounded-full"></div>
          <span>Semua Rute</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center scale-50">
             <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span>Titik / Simpang</span>
        </div>
      </div>
    </div>
  );
};

export default MapVisualizer;

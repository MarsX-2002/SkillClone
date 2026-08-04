import React, { useState } from 'react';
import { Network, Cpu, ShieldCheck, Zap, ArrowRight, Activity, Server } from 'lucide-react';

export default function SwarmGraph({ agents, onSelectAgent }) {
  const [activeNode, setActiveNode] = useState(agents[0]);

  // Node position map on canvas
  const nodePositions = [
    { x: 220, y: 140, label: "Tashkent Hub (Prof. Vakhidov)", agentIndex: 0 },
    { x: 580, y: 160, label: "Silicon Valley Hub (Elena Rostova)", agentIndex: 1 },
    { x: 300, y: 360, label: "Silk Road Archive (Scholar Temurov)", agentIndex: 2 },
    { x: 620, y: 380, label: "Neural AI Swarm (SOPHIA-9)", agentIndex: 3 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Network color="#6366f1" size={28} /> Knowledge Swarm Network Topology
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Decentralized node graph orchestrating agent execution, vector embeddings, and cross-border knowledge routing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} /> Swarm Status: Optimal (4 Nodes Active)
          </div>
        </div>
      </div>

      {/* Main Canvas + Telemetry Drawer Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* SVG Network Canvas */}
        <div className="glass-panel" style={{ padding: '20px', minHeight: '480px', position: 'relative', overflow: 'hidden' }}>
          <svg style={{ width: '100%', height: '100%', minHeight: '440px' }}>
            <defs>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Network Connections */}
            <line x1="220" y1="140" x2="580" y2="160" stroke="url(#lineGlow)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="220" y1="140" x2="300" y2="360" stroke="url(#lineGlow)" strokeWidth="2" />
            <line x1="580" y1="160" x2="620" y2="380" stroke="url(#lineGlow)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="300" y1="360" x2="620" y2="380" stroke="url(#lineGlow)" strokeWidth="2" />
            <line x1="220" y1="140" x2="620" y2="380" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" />

            {/* Node Dots */}
            {nodePositions.map((pos, idx) => {
              const agent = agents[pos.agentIndex] || agents[0];
              const isSelected = activeNode?.id === agent.id;
              return (
                <g key={idx} onClick={() => setActiveNode(agent)} style={{ cursor: 'pointer' }}>
                  {/* Outer Pulsing Aura */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? "32" : "24"}
                    fill={isSelected ? "rgba(99, 102, 241, 0.25)" : "rgba(6, 182, 212, 0.15)"}
                    stroke={isSelected ? "#6366f1" : "#06b6d4"}
                    strokeWidth={isSelected ? "3" : "1.5"}
                    className="animate-pulse-glow"
                  />
                  {/* Inner Core */}
                  <circle cx={pos.x} cy={pos.y} r="8" fill={isSelected ? "#818cf8" : "#22d3ee"} />
                  {/* Label */}
                  <text
                    x={pos.x}
                    y={pos.y + 45}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="var(--font-heading)"
                  >
                    {agent.name}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 60}
                    textAnchor="middle"
                    fill="var(--text-dim)"
                    fontSize="10"
                  >
                    {agent.category}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{ position: 'absolute', bottom: '16px', left: '20px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            💡 Click any node to inspect real-time swarm telemetry and knowledge vectors.
          </div>
        </div>

        {/* Node Telemetry Details Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {activeNode ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img
                  src={activeNode.avatar}
                  alt={activeNode.name}
                  style={{ width: '54px', height: '54px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeNode.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#818cf8' }}>{activeNode.title}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                  REAL-TIME NODE TELEMETRY
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-dim)' }}>Node Latency</div>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>18ms</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-dim)' }}>Vector Chunks</div>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>1,420 vectors</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-dim)' }}>Uptime</div>
                    <div style={{ fontWeight: 700, color: '#f59e0b' }}>99.98%</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-dim)' }}>Consensus</div>
                    <div style={{ fontWeight: 700, color: '#818cf8' }}>Raft Swarm</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                  INGESTED DOMAIN SOURCES
                </div>
                {activeNode.knowledgeSources?.map((src, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Server size={12} color="#06b6d4" /> {src}
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectAgent(activeNode)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                Launch 1-on-1 Mentorship <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
              Select a node on the swarm topology canvas to view telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

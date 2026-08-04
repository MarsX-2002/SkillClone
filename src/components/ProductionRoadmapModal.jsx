import React from 'react';
import { X, Rocket, Cpu, Server, ShieldCheck, Database, Zap, Code, Terminal, CheckCircle2, ArrowRight, Layers, Lock } from 'lucide-react';

export default function ProductionRoadmapModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '85vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div className="badge badge-indigo" style={{ marginBottom: '6px' }}>
              <Rocket size={13} /> Incubator to Production Scaling Specification
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Real SWE, ML & AI Agent <span className="gradient-text">Production Infrastructure</span>
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon"><X size={18} /></button>
        </div>

        {/* Introduction */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
          While the current frontend MVP provides a complete interactive dual-portal experience, here is the full production-grade SWE architecture, distributed vector pipeline, and Ray cluster infrastructure being deployed for global scale.
        </p>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          
          {/* Feature 1 */}
          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Database size={20} color="#818cf8" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Graph RAG & Distributed Vector DB</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Production Qdrant / Milvus cluster with hybrid dense-sparse vectors (<code style={{ color: '#38bdf8' }}>bge-large-en</code> + BM25) coupled with Neo4j entity-relation knowledge graphs for multi-hop expert reasoning.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Server size={20} color="#22d3ee" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>vLLM & Ray Swarm Orchestrator</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Ray Core distributed multi-agent actors running self-hosted LLaMA-3.3 70B & Qwen-2.5-Coder models with PagedAttention continuous batching on Kubernetes GPU pools (NVIDIA H100).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Lock size={20} color="#34d399" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Production Payme & Click Microservices</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              PCI-DSS compliant REST Webhook microservice written in Go with SHA-256 HMAC header verification, automated UZS currency conversion, and direct bank settlement.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Terminal size={20} color="#fbbf24" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Firecracker MicroVM Code Sandbox</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Isolated ephemeral microVM sandboxes (&lt;100ms cold start) running student python/javascript code generated during technical interviews and algorithm mentorship.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #ec4899' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Zap size={20} color="#f472b6" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Full-Duplex Voice AI (&lt;300ms)</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Deepgram streaming WebRTC Speech-to-Text paired with ElevenLabs zero-shot voice cloning, reproducing expert voices for natural conversational audio mentorship.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Layers size={20} color="#a78bfa" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Automated LoRA Fine-Tuning Pipeline</h4>
            </div>
            <p style={{ fontSize: '0.8mn', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Unsloth + PEFT automated pipeline training adapter weights directly from expert uploaded lectures, MP4 videos, GitHub repos, and PDF archives.
            </p>
          </div>

        </div>

        {/* Roadmap Timeline */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', padding: '20px', borderRadius: '14px', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#818cf8' }}>
            🗺️ Multi-Phase Production Roadmap
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge badge-emerald"><CheckCircle2 size={12} /> Phase 1 (Completed)</span>
              <span>Incubator Dual-Portal Web MVP, Hybrid Streaming Engine & Gateway Simulation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge badge-indigo">Phase 2 (Q4 2026)</span>
              <span>Qdrant Vector Cluster, Payme/Click HMAC Webhooks & vLLM GPU Serving</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge badge-cyan">Phase 3 (Q2 2027)</span>
              <span>LoRA Fine-Tuning Pipeline, Full-Duplex WebRTC Voice & Multi-Region Swarm</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            📄 Complete specification saved in <code style={{ color: '#38bdf8' }}>TECHNICAL_SPEC_AND_ROADMAP.md</code>
          </div>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

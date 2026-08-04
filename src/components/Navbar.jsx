import React from 'react';
import { Network, MessageSquare, PlusCircle, Wallet, Settings, Sparkles, BookOpen, Layers, Rocket } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, walletUSD, onOpenCheckout, onOpenSettings, onOpenRoadmap }) {
  const walletUZS = Math.round(walletUSD * 12500);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('marketplace')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Network size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              SkillClone <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '6px', color: '#818cf8' }}>AI NETWORK</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Decentralized Mentorship</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`btn btn-sm ${activeTab === 'marketplace' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'marketplace' ? 'none' : 'transparent' }}
          >
            <BookOpen size={15} /> Marketplace
          </button>
          
          <button
            onClick={() => setActiveTab('chat')}
            className={`btn btn-sm ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'chat' ? 'none' : 'transparent' }}
          >
            <MessageSquare size={15} /> 1-on-1 Mentorship
          </button>

          <button
            onClick={() => setActiveTab('swarm')}
            className={`btn btn-sm ${activeTab === 'swarm' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'swarm' ? 'none' : 'transparent' }}
          >
            <Layers size={15} /> Knowledge Swarm
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`btn btn-sm ${activeTab === 'creator' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: activeTab === 'creator' ? 'none' : 'transparent' }}
          >
            <PlusCircle size={15} /> Creator Studio
          </button>
        </nav>

        {/* User Wallet, Roadmap & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Production Roadmap Trigger */}
          <button
            onClick={onOpenRoadmap}
            className="btn btn-secondary btn-sm"
            style={{ border: '1px solid var(--border-glass-glow)', background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' }}
            title="Inspect Production Engineering Specification & Roadmap"
          >
            <Rocket size={14} /> Production Roadmap
          </button>

          {/* Wallet Balance Widget */}
          <div 
            onClick={onOpenCheckout}
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '6px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <Wallet size={16} color="#34d399" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
                ${walletUSD.toFixed(2)} USD
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                ~{walletUZS.toLocaleString()} UZS
              </div>
            </div>
          </div>

          {/* Settings Trigger */}
          <button 
            onClick={onOpenSettings}
            className="btn btn-secondary btn-icon"
            title="AI Engine Settings & API Keys"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

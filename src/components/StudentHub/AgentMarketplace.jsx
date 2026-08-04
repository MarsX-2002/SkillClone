import React, { useState } from 'react';
import { Search, Star, ShieldCheck, BookOpen, Clock, ArrowUpRight, Sparkles, Unlock, Calendar, CheckCircle2, Award } from 'lucide-react';
import { StorageService } from '../../services/storage.js';

export default function AgentMarketplace({ agents, onSelectAgent, onUnlockTrigger }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const unlockedIds = StorageService.getUnlockedAgentIds();
  const subscribedIds = StorageService.getSubscribedAgentIds();

  const categories = ['All', 'Computer Science', 'Business & Startups', 'History & Culture', 'AI & Engineering'];

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(13, 17, 28, 0.8) 100%)',
        border: '1px solid var(--border-glass-glow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px' }}>
          <div className="badge badge-indigo" style={{ marginBottom: '12px' }}>
            <Sparkles size={13} /> Low-Friction AI Mentorship Network
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '14px', lineHeight: 1.2 }}>
            Learn 1-on-1 From Cloned <span className="gradient-text">World-Class Mentors</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
            Zero friction, high-trust student access models: Unlock lifetime access to structured expert clones, or subscribe to evolving creator channels with native <strong>Payme, Click, and Stripe</strong> options.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', color: '#34d399' }}>
              <Unlock size={16} /> One-Time Skill Unlock ($15–$49 Buy Once, Own Forever)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', color: '#818cf8' }}>
              <Calendar size={16} /> Creator Subscription ($9.99/mo Channel Access)
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '300px', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="glass-input"
            placeholder="Search mentors by topic, university, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: selectedCategory === cat ? 'none' : '1px solid var(--border-glass)' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid-cards">
        {filteredAgents.map((agent) => {
          const isUnlocked = unlockedIds.includes(agent.id);
          const isSubscribed = subscribedIds.includes(agent.id);
          const hasAccess = isUnlocked || isSubscribed;

          return (
            <div
              key={agent.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Agent Header */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid rgba(99, 102, 241, 0.4)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{agent.name}</h3>
                      {agent.isVerified && <ShieldCheck size={16} color="#10b981" title="Verified Creator Knowledge" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginTop: '2px' }}>
                      {agent.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {agent.institution}
                    </div>
                  </div>
                </div>

                {/* Ownership Status Badge */}
                {hasAccess ? (
                  <div style={{ marginBottom: '14px' }}>
                    <span className="badge badge-emerald">
                      <CheckCircle2 size={12} /> {isUnlocked ? 'Lifetime Skill Unlocked' : 'Channel Sub Active'}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span className="badge badge-indigo">
                      <Unlock size={10} /> ${agent.oneTimeUnlockUSD || 29.99} Lifetime
                    </span>
                    <span className="badge badge-cyan">
                      <Calendar size={10} /> ${agent.monthlySubUSD || 9.99}/mo
                    </span>
                  </div>
                )}

                {/* Rating & Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 600 }}>
                    <Star size={15} fill="#fbbf24" /> {agent.rating}
                  </div>
                  <div>•</div>
                  <div>{agent.sessionsCount.toLocaleString()} learners</div>
                </div>

                {/* Bio snippet */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {agent.bio}
                </p>

                {/* Cloned Knowledge Badges */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
                    CLONED KNOWLEDGE BASE ({agent.knowledgeSources?.length || 0} SOURCES)
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {agent.knowledgeSources?.map((source, i) => (
                      <span key={i} className="badge badge-cyan" style={{ fontSize: '0.7rem', textTransform: 'none' }}>
                        <BookOpen size={10} /> {source.split('.')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div style={{
                borderTop: '1px solid var(--border-glass)',
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  {hasAccess ? (
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
                      Unlimited 1-on-1 Access
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>
                        ${agent.oneTimeUnlockUSD || 29.99} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>lifetime</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        or ${agent.monthlySubUSD || 9.99}/mo sub
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!hasAccess && (
                    <button
                      onClick={() => onUnlockTrigger(agent)}
                      className="btn btn-emerald btn-sm"
                      title="Unlock Lifetime Access or Monthly Sub"
                    >
                      Unlock
                    </button>
                  )}
                  <button
                    onClick={() => onSelectAgent(agent)}
                    className="btn btn-primary btn-sm"
                  >
                    Start Session <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

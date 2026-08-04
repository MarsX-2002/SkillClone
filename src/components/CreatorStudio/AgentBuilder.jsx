import React, { useState } from 'react';
import { PlusCircle, Sparkles, Check, DollarSign, BookOpen, User, ShieldCheck } from 'lucide-react';
import { StorageService } from '../../services/storage.js';

export default function AgentBuilder({ onAgentPublished }) {
  const knowledgeDocs = StorageService.getKnowledgeDocs();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [priceUSD, setPriceUSD] = useState(0.25);
  const [bio, setBio] = useState('');
  const [greeting, setGreeting] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isPublished, setIsPublished] = useState(false);

  const priceUZS = Math.round(priceUSD * 12500);

  const toggleDocSelect = (docName) => {
    if (selectedDocs.includes(docName)) {
      setSelectedDocs(selectedDocs.filter(d => d !== docName));
    } else {
      setSelectedDocs([...selectedDocs, docName]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    const newAgent = StorageService.saveAgent({
      name,
      title,
      institution: institution || 'Independent Creator',
      category,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      pricePerMinUSD: parseFloat(priceUSD),
      pricePerMinUZS: priceUZS,
      bio: bio || `Autonomous cloned AI teacher agent trained by ${name}.`,
      greeting: greeting || `Assalomu alaykum! I am ${name}'s cloned AI agent. Ask me anything!`,
      knowledgeSources: selectedDocs.length > 0 ? selectedDocs : ["Uploaded_Notes_Vector_Pack.pdf"]
    });

    setIsPublished(true);
    setTimeout(() => {
      setIsPublished(false);
      if (onAgentPublished) onAgentPublished(newAgent);
    }, 1200);
  };

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Sparkles color="#6366f1" size={24} />
        <h3 style={{ fontSize: '1.3rem' }}>2. Build & Configure AI Teacher Agent Persona</h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Set your agent's identity, per-minute mentorship pricing, system persona instructions, and bind ingested vector knowledge.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Creator / Expert Full Name *
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Dr. Sardor Azimov"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Academic Title / Industry Specialty *
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Head of Machine Learning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              University / Institution / Organization
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Tashkent State Technical University"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Primary Domain Category
            </label>
            <select
              className="glass-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Business & Startups">Business & Startups</option>
              <option value="History & Culture">History & Culture</option>
              <option value="AI & Engineering">AI & Engineering</option>
            </select>
          </div>
        </div>

        {/* Pricing Config */}
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '12px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#34d399', marginBottom: '8px' }}>
            💰 Session Rate (You receive 70% of gross session revenue)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>USD Rate per minute</label>
              <input
                type="number"
                step="0.05"
                min="0.05"
                max="5.00"
                className="glass-input"
                value={priceUSD}
                onChange={(e) => setPriceUSD(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Automated UZS Conversion</label>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', paddingTop: '8px' }}>
                ~{priceUZS.toLocaleString()} UZS / min
              </div>
            </div>
          </div>
        </div>

        {/* Bio & System Prompt */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Agent Bio & Credentials Summary
          </label>
          <textarea
            className="glass-input"
            rows={3}
            placeholder="Cloned from 10+ years of university lectures, papers on AI..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Default Initial Greeting
          </label>
          <input
            type="text"
            className="glass-input"
            placeholder="Assalomu alaykum! How can I guide your algorithm study today?"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
          />
        </div>

        {/* Select Uploaded Knowledge Docs */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Bind Ingested Knowledge Documents ({selectedDocs.length} Selected)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {knowledgeDocs.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Upload files in Section 1 to bind them here.
              </div>
            ) : (
              knowledgeDocs.map((doc) => {
                const isSelected = selectedDocs.includes(doc.name);
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => toggleDocSelect(doc.name)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <BookOpen size={12} /> {doc.name}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '14px', marginTop: '12px' }}>
          {isPublished ? (
            <><Check size={18} /> Published to Decentralized Network!</>
          ) : (
            <><PlusCircle size={18} /> Publish AI Agent to Global Marketplace</>
          )}
        </button>
      </form>
    </div>
  );
}

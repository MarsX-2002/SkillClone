import React, { useState } from 'react';
import { X, Key, Cpu, Sparkles, Check } from 'lucide-react';
import { StorageService } from '../services/storage.js';

export default function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const current = StorageService.getApiKeys();
  const [provider, setProvider] = useState(current.provider || 'fallback');
  const [openaiKey, setOpenaiKey] = useState(current.openai || '');
  const [geminiKey, setGeminiKey] = useState(current.gemini || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    StorageService.saveApiKeys({
      provider,
      openai: openaiKey.trim(),
      gemini: geminiKey.trim()
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#818cf8" />
            <h3 style={{ fontSize: '1.2rem' }}>AI Engine Configuration</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon"><X size={18} /></button>
        </div>

        <form onSubmit={handleSave}>
          {/* Provider Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Select Active AI Intelligence Engine
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '10px',
                background: provider === 'fallback' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: provider === 'fallback' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>⚡ Internal Domain Streaming (Default)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero API key required. Instant response streaming with pre-loaded expert knowledge.</div>
                </div>
                <input
                  type="radio"
                  name="provider"
                  checked={provider === 'fallback'}
                  onChange={() => setProvider('fallback')}
                />
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '10px',
                background: provider === 'openai' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: provider === 'openai' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                cursor: 'pointer'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>🤖 OpenAI (GPT-4o / GPT-4o-mini)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requires your personal OpenAI API Key</div>
                </div>
                <input
                  type="radio"
                  name="provider"
                  checked={provider === 'openai'}
                  onChange={() => setProvider('openai')}
                />
              </label>
            </div>
          </div>

          {/* OpenAI API Key Field */}
          {provider === 'openai' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                OpenAI API Key (sk-...)
              </label>
              <input
                type="password"
                className="glass-input"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isSaved ? <><Check size={16} /> Saved!</> : 'Save Engine Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

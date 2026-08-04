import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Trash2, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { StorageService } from '../../services/storage.js';

export default function KnowledgeIngestion({ onDocAdded }) {
  const [uploadedDocs, setUploadedDocs] = useState(() => StorageService.getKnowledgeDocs());
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleText, setSampleText] = useState('');
  const [docTitle, setDocTitle] = useState('');

  const handleSimulatedUpload = (fileObj) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: fileObj.name || `${docTitle || 'Domain Knowledge'}.pdf`,
        sizeKB: fileObj.size ? Math.round(fileObj.size / 1024) : 480,
        chunkCount: Math.floor(Math.random() * 25) + 10,
        uploadedAt: new Date().toISOString().split('T')[0],
        sampleSnippet: sampleText || "Cloned expert notes: Advanced multi-stage optimization algorithms for high-throughput multi-agent networks..."
      };

      const updated = StorageService.saveKnowledgeDoc(newDoc);
      setUploadedDocs(updated);
      setIsProcessing(false);
      setDocTitle('');
      setSampleText('');
      if (onDocAdded) onDocAdded(newDoc);
    }, 1200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    handleSimulatedUpload({ name: `${docTitle}.md` });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Drag & Drop Upload Zone */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload color="#6366f1" size={20} /> 1. Upload & Vectorize Proprietary Knowledge
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Upload PDF textbooks, lecture notes, markdown guides, or research papers. Our vector pipeline chunking engine prepares them for 1-on-1 agent mentorship.
        </p>

        {/* Drag Drop Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files.length > 0) {
              handleSimulatedUpload(e.dataTransfer.files[0]);
            }
          }}
          style={{
            border: isDragging ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-glass-glow)',
            background: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(13, 17, 28, 0.5)',
            borderRadius: '16px',
            padding: '36px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-normal)'
          }}
        >
          <BookOpen size={48} color="#818cf8" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>
            {isProcessing ? 'Extracting & Generating Vector Embeddings...' : 'Drag and drop knowledge files here'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Supports PDF, MD, TXT, DOCX (Max 50MB per file)
          </div>

          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            Browse Local File
            <input
              type="file"
              accept=".pdf,.md,.txt,.docx"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleSimulatedUpload(e.target.files[0])}
            />
          </label>
        </div>

        {/* Manual Text Ingestion Option */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Or Paste Direct Text / Syllabus Notes:</h4>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              className="glass-input"
              placeholder="Document Title (e.g. Stanford CS229 Machine Learning Lecture Notes)"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              required
            />
            <textarea
              className="glass-input"
              rows={4}
              placeholder="Paste raw domain knowledge text, Q&A pairs, or curriculum summary..."
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
            />
            <button type="submit" disabled={isProcessing} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              <Cpu size={16} /> Process & Save Vector Memory
            </button>
          </form>
        </div>
      </div>

      {/* Ingested Knowledge Library */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} color="#10b981" /> Vectorized Document Vault ({uploadedDocs.length})
        </h4>

        {uploadedDocs.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center', padding: '20px 0' }}>
            No knowledge documents uploaded yet. Upload a file above to train your AI agent.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {uploadedDocs.map((doc) => (
              <div key={doc.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <FileText size={20} color="#38bdf8" />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {doc.sizeKB} KB • {doc.chunkCount} Vector Chunks
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', fontStyle: 'italic' }}>
                  "{doc.sampleSnippet.substring(0, 80)}..."
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

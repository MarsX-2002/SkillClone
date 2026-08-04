import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, BookOpen, Clock, HelpCircle, ArrowLeft, CheckCircle, Unlock, ShieldCheck, Cpu } from 'lucide-react';
import { AIEngine } from '../../services/aiEngine.js';
import { StorageService } from '../../services/storage.js';

export default function ChatWorkspace({ agent, walletUSD, onWalletUpdated, onBack, onTriggerUnlock }) {
  if (!agent) return null;

  const [messages, setMessages] = useState(() => StorageService.getChatHistory(agent.id));
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showSourcesDrawer, setShowSourcesDrawer] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const unlockedIds = StorageService.getUnlockedAgentIds();
  const subscribedIds = StorageService.getSubscribedAgentIds();
  const isUnlocked = unlockedIds.includes(agent.id);
  const isSubscribed = subscribedIds.includes(agent.id);
  const hasAccess = isUnlocked || isSubscribed;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Save chat history
  useEffect(() => {
    StorageService.saveChatHistory(agent.id, messages);
  }, [messages, agent.id]);

  // Quiet Backend Internal LLM Compute Cost Logger (does NOT deduct from student wallet!)
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => {
        const next = prev + 1;
        // Quiet backend tracking every 60s for compute telemetry
        if (next > 0 && next % 60 === 0) {
          const internalCost = agent.internalComputeCostPerMinUSD || 0.04;
          StorageService.recordInternalComputeCost(internalCost);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [agent]);

  // Initial greeting if chat empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: `msg-greet-${Date.now()}`,
          sender: 'agent',
          text: agent.greeting || `Assalomu alaykum! I am ${agent.name}. How can I guide your learning today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [agent]);

  // Handle Voice Input (Speech Recognition)
  const toggleVoiceInput = () => {
    if (isVoiceActive) {
      recognitionRef.current?.stop();
      setIsVoiceActive(false);
    } else {
      const rec = AIEngine.initSpeechRecognition(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsVoiceActive(false);
          }
        },
        (err) => {
          console.warn("Speech recognition error:", err);
          setIsVoiceActive(false);
        }
      );
      if (rec) {
        recognitionRef.current = rec;
        rec.start();
        setIsVoiceActive(true);
      }
    }
  };

  // Send Message & Stream AI Response
  const handleSendMessage = (textToSend = inputText) => {
    const prompt = textToSend.trim();
    if (!prompt || isStreaming) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsStreaming(true);

    const agentMsgId = `msg-agent-${Date.now()}`;

    // Create placeholder message for streaming
    setMessages(prev => [
      ...prev,
      {
        id: agentMsgId,
        sender: 'agent',
        text: '...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
      }
    ]);

    AIEngine.streamResponse(
      agent,
      prompt,
      updatedMessages,
      (chunk) => {
        setMessages(prev => prev.map(m => m.id === agentMsgId ? { ...m, text: chunk } : m));
      },
      (finalText) => {
        setIsStreaming(false);
        setMessages(prev => prev.map(m => m.id === agentMsgId ? { ...m, text: finalText, isStreaming: false } : m));
        if (isTtsEnabled) {
          AIEngine.speakText(finalText);
        }
      }
    );
  };

  const handleGenerateQuiz = () => {
    const quiz = AIEngine.generateQuiz(agent);
    setActiveQuiz(quiz);
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
  };

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = sessionSeconds % 60;
  const internalBackendComputeLog = ((sessionSeconds / 60) * (agent.internalComputeCostPerMinUSD || 0.04)).toFixed(3);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: showSourcesDrawer ? '1fr 320px' : '1fr', gap: '20px', height: 'calc(100vh - 120px)' }}>
      {/* Main Chat Box */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Workspace Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(13, 17, 28, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={onBack} className="btn btn-secondary btn-icon" title="Back to Marketplace">
              <ArrowLeft size={18} />
            </button>
            <img
              src={agent.avatar}
              alt={agent.name}
              style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {agent.name}
                {hasAccess ? (
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    <CheckCircle size={10} /> {isUnlocked ? 'Lifetime Unlocked' : 'Sub Active'}
                  </span>
                ) : (
                  <button onClick={() => onTriggerUnlock(agent)} className="badge badge-indigo" style={{ cursor: 'pointer', border: 'none' }}>
                    <Unlock size={10} /> Unlock ${agent.oneTimeUnlockUSD || 29.99}
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#818cf8' }}>{agent.title}</div>
            </div>
          </div>

          {/* Clean Student Access Status & Quiet Backend Compute Telemetry */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Internal LLM Compute Cost Log Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }} title="Backend compute tracking strictly internal to platform">
              <Cpu size={14} color="#06b6d4" />
              <span>Backend LLM Cost: <strong>${internalBackendComputeLog}</strong></span>
            </div>

            {/* Quiz Trigger */}
            <button onClick={handleGenerateQuiz} className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
              <HelpCircle size={14} color="#f59e0b" /> Quiz Me
            </button>

            {/* TTS Voice Toggle */}
            <button
              onClick={() => {
                if (isTtsEnabled) AIEngine.stopSpeaking();
                setIsTtsEnabled(!isTtsEnabled);
              }}
              className={`btn btn-sm ${isTtsEnabled ? 'btn-primary' : 'btn-secondary'}`}
              title="Toggle Text-to-Speech Mentor Voice"
            >
              {isTtsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Sources Drawer Toggle */}
            <button
              onClick={() => setShowSourcesDrawer(!showSourcesDrawer)}
              className={`btn btn-sm ${showSourcesDrawer ? 'btn-primary' : 'btn-secondary'}`}
            >
              <BookOpen size={15} /> Sources
            </button>
          </div>
        </div>

        {/* Quiz Modal overlay inside workspace if active */}
        {activeQuiz && (
          <div style={{
            background: 'rgba(15, 20, 34, 0.95)',
            borderBottom: '1px solid var(--border-glass-glow)',
            padding: '20px',
            maxHeight: '40%',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} /> Interactive Knowledge Check
              </h4>
              <button onClick={() => setActiveQuiz(null)} className="btn btn-secondary btn-sm">Close Quiz</button>
            </div>

            {activeQuiz.map((q, qIndex) => (
              <div key={qIndex} style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>{qIndex + 1}. {q.question}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {q.options.map((opt, oIndex) => {
                    const isSelected = selectedQuizAnswers[qIndex] === oIndex;
                    const isCorrect = q.answerIndex === oIndex;
                    let bgColor = 'rgba(255, 255, 255, 0.04)';
                    let borderColor = 'var(--border-glass)';
                    if (quizSubmitted) {
                      if (isCorrect) { bgColor = 'rgba(16, 185, 129, 0.2)'; borderColor = '#10b981'; }
                      else if (isSelected) { bgColor = 'rgba(244, 63, 94, 0.2)'; borderColor = '#f43f5e'; }
                    } else if (isSelected) {
                      bgColor = 'rgba(99, 102, 241, 0.2)'; borderColor = 'var(--accent-primary)';
                    }
                    return (
                      <button
                        key={oIndex}
                        onClick={() => !quizSubmitted && setSelectedQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${borderColor}`,
                          background: bgColor,
                          color: 'var(--text-main)',
                          textAlign: 'left',
                          fontSize: '0.8rem',
                          cursor: quizSubmitted ? 'default' : 'pointer'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!quizSubmitted ? (
              <button onClick={() => setQuizSubmitted(true)} className="btn btn-emerald btn-sm" style={{ marginTop: '8px' }}>
                Submit Quiz Answers
              </button>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> Quiz Complete! Review explanations above.
              </div>
            )}
          </div>
        )}

        {/* Chat History List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justify: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '12px'
              }}
            >
              {msg.sender === 'agent' && (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
                />
              )}

              <div style={{
                maxWidth: '75%',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(18, 22, 34, 0.95)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-glass-glow)',
                padding: '14px 18px',
                borderRadius: '16px',
                borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.sender === 'agent' ? '4px' : '16px',
                boxShadow: msg.sender === 'user' ? '0 4px 14px rgba(99, 102, 241, 0.3)' : 'var(--shadow-glass)'
              }}>
                <div className="prose-custom" style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: 'right', marginTop: '6px' }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          {isStreaming && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <span>{agent.name} is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(13, 17, 28, 0.8)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          {/* Voice Input Button */}
          <button
            onClick={toggleVoiceInput}
            className={`btn btn-icon ${isVoiceActive ? 'btn-amber animate-pulse-glow' : 'btn-secondary'}`}
            title={isVoiceActive ? "Listening... Speak now" : "Speak to Mentor (STT)"}
          >
            {isVoiceActive ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            className="glass-input"
            placeholder={isVoiceActive ? "Listening to your voice..." : `Ask ${agent.name} anything regarding their knowledge base...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{ flex: 1 }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isStreaming}
            className="btn btn-primary"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Cloned Sources Drawer */}
      {showSourcesDrawer && (
        <div className="glass-panel" style={{ padding: '20px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="#06b6d4" /> Verified Knowledge
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Document snippets cloned into this AI agent's neural memory:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {agent.knowledgeSources?.map((source, index) => (
              <div key={index} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>
                  📄 {source}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                  Vector embedding chunk #{index * 12 + 104} • Indexed via decentralized swarm node.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

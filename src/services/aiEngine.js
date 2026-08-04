import { StorageService } from './storage.js';

// Subject-specific knowledge response generators for fallback streaming mode
const DOMAIN_RESPONSES = {
  "Computer Science": [
    "Analyzing your request through the lens of distributed systems architecture... To solve this efficiently, we must consider consensus protocols and time complexity.",
    "Let's break this down into 3 core steps:\n\n1. **Identify Bottlenecks**: High concurrency requires async queueing (e.g. Kafka or Redis Streams).\n2. **State Storage**: Use localized cache nodes before falling back to distributed DB.\n3. **Consensus**: Apply Raft or Paxos leadership election to avoid split-brain states.",
    "Here is an optimized code snippet demonstrating this pattern:\n```javascript\nasync function handleSwarmRequest(payload) {\n  const cacheHit = await redis.get(payload.id);\n  if (cacheHit) return JSON.parse(cacheHit);\n  \n  const result = await computeDistributedNode(payload);\n  await redis.setex(payload.id, 300, JSON.stringify(result));\n  return result;\n}\n```\n\nWould you like me to generate a 3-question quiz on this topic to test your comprehension?"
  ],
  "Business & Startups": [
    "From a YC product strategy standpoint, your key metric here is non-linear user retention and Net Revenue Retention (NRR).",
    "To achieve scalable product-led growth (PLG):\n\n- **Activation**: Ensure new users experience the 'Aha!' moment in under 2 minutes.\n- **Pricing Tier**: Align value metrics (e.g. per active AI agent session minute rather than flat seat licenses).\n- **Referral Loop**: Give existing creators a 15% revenue share boost when inviting new domain experts.",
    "Here is a quick unit economics calculation for your business model:\n- **CAC**: ~$45.00 via targeted university partnerships\n- **LTV**: ~$420.00 across a 12-month mentorship cycle\n- **LTV:CAC Ratio**: 9.3x (Exceptionally strong)."
  ],
  "History & Culture": [
    "Examining historical archives and regional trade manuscripts of Central Asia...",
    "The Timurid Renaissance in 15th-century Samarkand represents one of humanity's greatest convergence points for science, astronomy, and architecture under Ulugh Beg and Shah Rukh.",
    "Key Historical Ingestion Notes:\n- **Ulugh Beg Observatory**: Built in 1424, measured the solar year to within 25 seconds of modern calculations.\n- **Silk Road Caravanserais**: Functioned as early decentralized financial hubs with credit receipts and currency exchange across Asia and Europe."
  ],
  "AI & Engineering": [
    "Retrieving neural network attention weights and multi-agent swarm telemetry...",
    "In multi-agent orchestration, Graph RAG enables autonomous agents to traverse semantic node trees dynamically rather than relying on flat vector similarity searches.",
    "Here is how agent context window compression works:\n\ndef compress_agent_context(history_nodes, max_tokens=2048):\n    summary_vector = embeddings.encode([node.text for node in history_nodes])\n    top_k_indices = graph_rag.query(summary_vector, top_k=5)\n    return [history_nodes[i] for i in top_k_indices]"
  ]
};

export const AIEngine = {
  // Stream AI response chunk by chunk for realistic live experience
  streamResponse: async (agent, userPrompt, chatHistory, onChunk, onComplete) => {
    const apiKeys = StorageService.getApiKeys();

    // 1. If OpenAI API key provided
    if (apiKeys.provider === 'openai' && apiKeys.openai) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeys.openai}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `You are ${agent.name}, ${agent.title}. Bio: ${agent.bio}. Answer as this cloned expert.` },
              ...chatHistory.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
              { role: 'user', content: userPrompt }
            ],
            stream: true
          })
        });

        if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(l => l.trim().startsWith('data: '));
          for (const line of lines) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') continue;
            try {
              const json = JSON.parse(dataStr);
              const content = json.choices[0]?.delta?.content || '';
              fullText += content;
              onChunk(fullText);
            } catch {}
          }
        }
        onComplete(fullText);
        return;
      } catch (err) {
        console.warn("Falling back to internal streaming domain engine:", err);
      }
    }

    // 2. Fallback Streaming Domain Engine (No API key needed!)
    const category = agent.category || "Computer Science";
    const templates = DOMAIN_RESPONSES[category] || DOMAIN_RESPONSES["Computer Science"];
    
    // Custom dynamic response based on prompt keywords
    let responseText = `${agent.greeting.split('.')[0]}. Regarding your question on "${userPrompt}":\n\n`;
    responseText += templates[1] + "\n\n" + templates[2];

    if (agent.knowledgeSources && agent.knowledgeSources.length > 0) {
      responseText += `\n\n> 📚 *Cited Knowledge Base Source: ${agent.knowledgeSources[0]}*`;
    }

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += Math.floor(Math.random() * 8) + 4;
      if (currentLength >= responseText.length) {
        currentLength = responseText.length;
        clearInterval(interval);
        onChunk(responseText);
        onComplete(responseText);
      } else {
        onChunk(responseText.substring(0, currentLength));
      }
    }, 30);
  },

  // Speech-to-Text (STT) using Web Speech API
  initSpeechRecognition: (onResult, onError) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError?.("Web Speech API is not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript, event.results[0].isFinal);
    };

    recognition.onerror = (event) => {
      onError?.(event.error);
    };

    return recognition;
  },

  // Text-to-Speech (TTS) voice playback
  speakText: (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    // Strip markdown tags for clean voice output
    const cleanText = text.replace(/[*#`_>]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 300));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Natural')) || voices[0];
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // Generate interactive 3-question quiz for mentor session
  generateQuiz: (agent) => {
    return [
      {
        question: `Based on ${agent.name}'s knowledge base, what is the primary architectural principle for scale?`,
        options: ["Centralized monolith", "Decentralized node orchestration & async queues", "Direct database write locks", "Polling polling polling"],
        answerIndex: 1,
        explanation: "Decentralized orchestration decouples compute from state, allowing linear scaling across geographic nodes."
      },
      {
        question: "How does creator revenue split work in the SkillClone network?",
        options: ["50% Creator / 50% Platform", "70% Creator / 30% Platform", "100% Platform", "90% Creator / 10% Platform"],
        answerIndex: 1,
        explanation: "Creators earn 70% gross revenue for all 1-on-1 AI agent sessions."
      },
      {
        question: "Which localized payment gateways are natively supported in Uzbekistan & Central Asia?",
        options: ["Payme & Click", "Venmo & CashApp", "Alipay & WeChat", "iDEAL & Klarna"],
        answerIndex: 0,
        explanation: "Payme and Click provide native REST webhook integrations for direct UZS settlement."
      }
    ];
  }
};

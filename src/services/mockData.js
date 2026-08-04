export const INITIAL_AGENTS = [
  {
    id: "agent-vakhidov",
    name: "Dr. Alisher Vakhidov",
    title: "Professor of Algorithms & Distributed Systems",
    institution: "Tashkent IT University",
    category: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    rating: 4.95,
    sessionsCount: 4230,
    oneTimeUnlockUSD: 29.99,
    oneTimeUnlockUZS: 375000,
    monthlySubUSD: 9.99,
    monthlySubUZS: 125000,
    internalComputeCostPerMinUSD: 0.04,
    accessModel: "One-Time Skill Unlock or Creator Channel Sub",
    isVerified: true,
    bio: "Cloned from 15+ years of university lectures, papers on high-throughput microservices, dynamic programming, and system architecture. Mentors students in technical interviews and system design.",
    knowledgeSources: [
      "Distributed Systems Consensus Protocols (Raft & Paxos).pdf",
      "Advanced Dynamic Programming Solutions Handbook.md",
      "System Design Interview Cheatsheet v4.2.pdf"
    ],
    greeting: "Assalomu alaykum! I am Dr. Vakhidov's cloned AI agent. How can I guide your algorithm or distributed systems study today?",
    sampleQuestions: [
      "Can you explain Raft consensus in simple terms?",
      "How do I optimize a dynamic programming knapsack problem?",
      "Design a scalable rate limiter for 10M active connections."
    ]
  },
  {
    id: "agent-rostova",
    name: "Elena Rostova",
    title: "Silicon Valley Tech Founder & AI Product Specialist",
    institution: "Ex-YC Founder & Product Lead",
    category: "Business & Startups",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    rating: 4.92,
    sessionsCount: 3150,
    oneTimeUnlockUSD: 49.00,
    oneTimeUnlockUZS: 612500,
    monthlySubUSD: 9.99,
    monthlySubUZS: 125000,
    internalComputeCostPerMinUSD: 0.05,
    accessModel: "Lifetime Startup Mentorship Unlock",
    isVerified: true,
    bio: "Trained on pitch decks, product market fit frameworks, go-to-market strategies, and VC fundraising playbooks. Helping founders turn ideas into scalable tech ventures.",
    knowledgeSources: [
      "Seed Pitch Deck Breakdown & Investor FAQs.pdf",
      "Product-Led Growth & Retention Loop Masterclass.md",
      "Unit Economics & Monetization Calculator.xlsx"
    ],
    greeting: "Welcome! I'm Elena's autonomous AI agent. Ready to pressure-test your startup pitch, product roadmap, or pricing model?",
    sampleQuestions: [
      "How do I structure a seed deck for pre-revenue AI apps?",
      "What are the key SaaS retention metrics investors look for?",
      "Help me calculate Customer Acquisition Cost vs Lifetime Value."
    ]
  },
  {
    id: "agent-temur",
    name: "Scholar Bobur Temurov",
    title: "Central Asian & Silk Road History Specialist",
    institution: "Academy of Historical Sciences",
    category: "History & Culture",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    rating: 4.98,
    sessionsCount: 5810,
    oneTimeUnlockUSD: 15.00,
    oneTimeUnlockUZS: 187500,
    monthlySubUSD: 4.99,
    monthlySubUZS: 62500,
    internalComputeCostPerMinUSD: 0.02,
    accessModel: "Silk Road History Course Unlock",
    isVerified: true,
    bio: "Cloned from manuscripts, architectural archives, and Silk Road trade studies. Deep expertise in Samarkand, Bukhara, Timurid Renaissance, and Eurasian cultural history.",
    knowledgeSources: [
      "The Timurid Renaissance: Astronomy, Math & Art in Samarkand.pdf",
      "Silk Road Trade Routes & Monetary Systems.md"
    ],
    greeting: "Salom! I am Scholar Temurov's knowledge agent. Ask me anything regarding the history, monuments, and trade of Central Asia.",
    sampleQuestions: [
      "What was the significance of Ulugh Beg's Observatory in Samarkand?",
      "How did trade currency flow along the medieval Silk Road?",
      "Tell me about the architectural renaissance under the Timurids."
    ]
  },
  {
    id: "agent-sophia",
    name: "SOPHIA-9",
    title: "Neural Architecture & Quantum Computing Swarm Agent",
    institution: "Decentralized AI Lab",
    category: "AI & Engineering",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
    rating: 4.88,
    sessionsCount: 1980,
    oneTimeUnlockUSD: 35.00,
    oneTimeUnlockUZS: 437500,
    monthlySubUSD: 9.99,
    monthlySubUZS: 125000,
    internalComputeCostPerMinUSD: 0.06,
    accessModel: "Quantum & Neural Swarm Master Access",
    isVerified: true,
    bio: "An autonomous swarm agent aggregate trained on modern transformer architectures, agentic workflow orchestration, and quantum circuit synthesis.",
    knowledgeSources: [
      "Attention Is All You Need & Transformer Optimization.pdf",
      "Multi-Agent Orchestration & Graph RAG Protocols.md",
      "Qiskit Quantum Circuit Implementation Guide.pdf"
    ],
    greeting: "Greetings. I am SOPHIA-9. I can analyze neural network attention heads, multi-agent communication protocols, or quantum state vectors.",
    sampleQuestions: [
      "Explain Multi-Head Self-Attention mathematically.",
      "How does Graph RAG improve multi-step agent reasoning?",
      "What is the difference between qubit superposition and entanglement?"
    ]
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-101",
    type: "one_time_unlock",
    agentName: "Dr. Alisher Vakhidov",
    gateway: "Payme",
    currency: "UZS",
    amountUZS: 375000,
    amountUSD: 29.99,
    creatorSplitUSD: 20.99, // 70%
    platformSplitUSD: 9.00, // 30%
    timestamp: "2026-08-04T12:30:00Z",
    status: "Completed",
    reference: "PAYME-984210"
  },
  {
    id: "tx-102",
    type: "creator_subscription",
    agentName: "Elena Rostova",
    gateway: "Click",
    currency: "UZS",
    amountUSD: 9.99,
    amountUZS: 125000,
    creatorSplitUSD: 6.99, // 70%
    platformSplitUSD: 3.00, // 30%
    timestamp: "2026-08-04T14:15:00Z",
    status: "Settled"
  }
];

export const INITIAL_CREATOR_LEDGER = {
  totalGrossUSD: 489.50,
  creatorEarningsUSD: 342.65, // 70%
  platformFeeUSD: 146.85, // 30%
  pendingPayoutUSD: 262.10,
  paidOutUSD: 80.55,
  internalLlmComputeCostUSD: 18.40, // Backend LLM tracking
  payoutHistory: [
    {
      id: "po-501",
      date: "2026-08-01",
      method: "Payme / Uzbek National Card (8600 **** 4219)",
      amountUSD: 80.55,
      amountUZS: 1006875,
      status: "Transferred"
    }
  ]
};

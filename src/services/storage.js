import { INITIAL_AGENTS, INITIAL_TRANSACTIONS, INITIAL_CREATOR_LEDGER } from './mockData.js';

const STORAGE_KEYS = {
  AGENTS: 'skillclone_agents',
  WALLET_USD: 'skillclone_wallet_usd',
  TRANSACTIONS: 'skillclone_transactions',
  CREATOR_LEDGER: 'skillclone_creator_ledger',
  API_KEYS: 'skillclone_api_keys',
  CHAT_LOGS: 'skillclone_chat_logs',
  KNOWLEDGE_DOCS: 'skillclone_knowledge_docs',
  UNLOCKED_AGENTS: 'skillclone_unlocked_agents',
  SUBSCRIBED_AGENTS: 'skillclone_subscribed_agents'
};

export const StorageService = {
  // Get all agents (initial + user created)
  getAgents: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(INITIAL_AGENTS));
      return INITIAL_AGENTS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_AGENTS;
    }
  },

  // Save new agent
  saveAgent: (agentData) => {
    const agents = StorageService.getAgents();
    const newAgent = {
      ...agentData,
      id: `agent-custom-${Date.now()}`,
      rating: 5.0,
      sessionsCount: 0,
      isVerified: true
    };
    const updated = [newAgent, ...agents];
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(updated));
    return newAgent;
  },

  // Student Access & Unlocks
  getUnlockedAgentIds: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_AGENTS);
    return saved ? JSON.parse(saved) : ['agent-temur']; // Default pre-unlocked history agent
  },

  unlockAgent: (agentId) => {
    const ids = StorageService.getUnlockedAgentIds();
    if (!ids.includes(agentId)) {
      const updated = [...ids, agentId];
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_AGENTS, JSON.stringify(updated));
      return updated;
    }
    return ids;
  },

  getSubscribedAgentIds: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBED_AGENTS);
    return saved ? JSON.parse(saved) : [];
  },

  subscribeAgent: (agentId) => {
    const ids = StorageService.getSubscribedAgentIds();
    if (!ids.includes(agentId)) {
      const updated = [...ids, agentId];
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBED_AGENTS, JSON.stringify(updated));
      return updated;
    }
    return ids;
  },

  // Student Wallet
  getWalletUSD: () => {
    const val = localStorage.getItem(STORAGE_KEYS.WALLET_USD);
    return val ? parseFloat(val) : 50.00;
  },

  updateWalletUSD: (deltaUSD) => {
    const current = StorageService.getWalletUSD();
    const updated = Math.max(0, current + deltaUSD);
    localStorage.setItem(STORAGE_KEYS.WALLET_USD, updated.toFixed(2));
    return updated;
  },

  // Transactions
  getTransactions: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  },

  addTransaction: (tx) => {
    const txs = StorageService.getTransactions();
    const newTx = { ...tx, id: `tx-${Date.now()}`, timestamp: new Date().toISOString() };
    const updated = [newTx, ...txs];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    return updated;
  },

  // Creator Ledger & Internal Backend Compute Cost Tracking
  getCreatorLedger: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.CREATOR_LEDGER);
    return saved ? JSON.parse(saved) : INITIAL_CREATOR_LEDGER;
  },

  updateCreatorLedger: (grossSessionUSD) => {
    const ledger = StorageService.getCreatorLedger();
    const creatorShare = grossSessionUSD * 0.70;
    const platformShare = grossSessionUSD * 0.30;
    
    ledger.totalGrossUSD += grossSessionUSD;
    ledger.creatorEarningsUSD += creatorShare;
    ledger.platformFeeUSD += platformShare;
    ledger.pendingPayoutUSD += creatorShare;

    localStorage.setItem(STORAGE_KEYS.CREATOR_LEDGER, JSON.stringify(ledger));
    return ledger;
  },

  recordInternalComputeCost: (costUSD) => {
    const ledger = StorageService.getCreatorLedger();
    ledger.internalLlmComputeCostUSD = (ledger.internalLlmComputeCostUSD || 0) + costUSD;
    localStorage.setItem(STORAGE_KEYS.CREATOR_LEDGER, JSON.stringify(ledger));
    return ledger.internalLlmComputeCostUSD;
  },

  requestPayout: (amountUSD, method) => {
    const ledger = StorageService.getCreatorLedger();
    if (amountUSD > ledger.pendingPayoutUSD) return { success: false, message: 'Insufficient pending balance' };

    ledger.pendingPayoutUSD -= amountUSD;
    ledger.paidOutUSD += amountUSD;
    ledger.payoutHistory.unshift({
      id: `po-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      method,
      amountUSD,
      amountUZS: Math.round(amountUSD * 12500),
      status: "Processing Payout"
    });

    localStorage.setItem(STORAGE_KEYS.CREATOR_LEDGER, JSON.stringify(ledger));
    return { success: true, ledger };
  },

  // Custom API Keys
  getApiKeys: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    return saved ? JSON.parse(saved) : { openai: '', gemini: '', provider: 'fallback' };
  },

  saveApiKeys: (keys) => {
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
  },

  // Chat History
  getChatHistory: (agentId) => {
    const saved = localStorage.getItem(`${STORAGE_KEYS.CHAT_LOGS}_${agentId}`);
    return saved ? JSON.parse(saved) : [];
  },

  saveChatHistory: (agentId, messages) => {
    localStorage.setItem(`${STORAGE_KEYS.CHAT_LOGS}_${agentId}`, JSON.stringify(messages));
  },

  // Uploaded Knowledge Documents
  getKnowledgeDocs: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_DOCS);
    return saved ? JSON.parse(saved) : [];
  },

  saveKnowledgeDoc: (doc) => {
    const docs = StorageService.getKnowledgeDocs();
    const updated = [doc, ...docs];
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_DOCS, JSON.stringify(updated));
    return updated;
  }
};

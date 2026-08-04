import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import AgentMarketplace from './components/StudentHub/AgentMarketplace.jsx';
import ChatWorkspace from './components/StudentHub/ChatWorkspace.jsx';
import SwarmGraph from './components/StudentHub/SwarmGraph.jsx';
import KnowledgeIngestion from './components/CreatorStudio/KnowledgeIngestion.jsx';
import AgentBuilder from './components/CreatorStudio/AgentBuilder.jsx';
import EarningsLedger from './components/CreatorStudio/EarningsLedger.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import ProductionRoadmapModal from './components/ProductionRoadmapModal.jsx';
import { StorageService } from './services/storage.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'chat', 'swarm', 'creator'
  const [creatorSubTab, setCreatorSubTab] = useState('ingest'); // 'ingest', 'builder', 'ledger'
  
  const [agents, setAgents] = useState(() => StorageService.getAgents());
  const [activeAgent, setActiveAgent] = useState(agents[0]);
  const [walletUSD, setWalletUSD] = useState(() => StorageService.getWalletUSD());
  const [targetUnlockAgent, setTargetUnlockAgent] = useState(null);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  const refreshWallet = () => {
    setWalletUSD(StorageService.getWalletUSD());
  };

  const refreshAgents = () => {
    setAgents(StorageService.getAgents());
  };

  const handleSelectAgentForChat = (agent) => {
    setActiveAgent(agent);
    setActiveTab('chat');
  };

  const handleTriggerUnlockModal = (agent) => {
    setTargetUnlockAgent(agent);
    setIsCheckoutOpen(true);
  };

  const handleAgentPublished = (newAgent) => {
    refreshAgents();
    setActiveAgent(newAgent);
    setActiveTab('chat');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletUSD={walletUSD}
        onOpenCheckout={() => {
          setTargetUnlockAgent(null);
          setIsCheckoutOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
      />

      {/* Main View Container */}
      <main className="app-container" style={{ flex: 1 }}>
        {activeTab === 'marketplace' && (
          <AgentMarketplace
            agents={agents}
            onSelectAgent={handleSelectAgentForChat}
            onUnlockTrigger={handleTriggerUnlockModal}
          />
        )}

        {activeTab === 'chat' && (
          <ChatWorkspace
            agent={activeAgent || agents[0]}
            walletUSD={walletUSD}
            onWalletUpdated={refreshWallet}
            onBack={() => setActiveTab('marketplace')}
            onTriggerUnlock={handleTriggerUnlockModal}
          />
        )}

        {activeTab === 'swarm' && (
          <SwarmGraph
            agents={agents}
            onSelectAgent={handleSelectAgentForChat}
          />
        )}

        {activeTab === 'creator' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Creator Sub-navigation Tabs */}
            <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCreatorSubTab('ingest')}
                className={`btn btn-sm ${creatorSubTab === 'ingest' ? 'btn-primary' : 'btn-secondary'}`}
              >
                1. Knowledge Ingestion (Files / Notes)
              </button>
              <button
                onClick={() => setCreatorSubTab('builder')}
                className={`btn btn-sm ${creatorSubTab === 'builder' ? 'btn-primary' : 'btn-secondary'}`}
              >
                2. AI Agent Builder
              </button>
              <button
                onClick={() => setCreatorSubTab('ledger')}
                className={`btn btn-sm ${creatorSubTab === 'ledger' ? 'btn-primary' : 'btn-secondary'}`}
              >
                3. Earnings & Payout Ledger (70/30 Split)
              </button>
            </div>

            {creatorSubTab === 'ingest' && (
              <KnowledgeIngestion onDocAdded={refreshAgents} />
            )}

            {creatorSubTab === 'builder' && (
              <AgentBuilder onAgentPublished={handleAgentPublished} />
            )}

            {creatorSubTab === 'ledger' && (
              <EarningsLedger />
            )}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onWalletUpdated={() => {
          refreshWallet();
          refreshAgents();
        }}
        targetAgent={targetUnlockAgent}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ProductionRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
      />
    </div>
  );
}

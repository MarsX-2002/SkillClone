import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ShieldCheck, CreditCard, Clock, CheckCircle2, Building, Cpu, Unlock, Calendar } from 'lucide-react';
import { StorageService } from '../../services/storage.js';

export default function EarningsLedger() {
  const [ledger, setLedger] = useState(() => StorageService.getCreatorLedger());
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(100.00);
  const [payoutMethod, setPayoutMethod] = useState('payme');
  const [cardDetails, setCardDetails] = useState('8600 4210 9821 4412');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestPayout = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const res = StorageService.requestPayout(
        parseFloat(payoutAmount),
        payoutMethod === 'payme' ? `Payme / Uzbek Card (${cardDetails})` : `Click Merchant Wallet`
      );
      if (res.success) {
        setLedger(res.ledger);
        setShowPayoutModal(false);
      }
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Revenue Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Gross Sales</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            ${ledger.totalGrossUSD.toFixed(2)} USD
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            From Unlocks, Subscriptions & Bundles
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginBottom: '4px', fontWeight: 600 }}>
            Creator Share (70% Net)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            ${ledger.creatorEarningsUSD.toFixed(2)} USD
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Direct earnings per sale
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '4px', fontWeight: 600 }}>
            Platform Fee (30%)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8' }}>
            ${ledger.platformFeeUSD.toFixed(2)} USD
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Swarm node infrastructure
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.8rem', color: '#22d3ee', marginBottom: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={14} /> Backend LLM Compute
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22d3ee' }}>
            ${(ledger.internalLlmComputeCostUSD || 18.40).toFixed(2)} USD
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Internal backend cost log
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pending Payout</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            ${ledger.pendingPayoutUSD.toFixed(2)} USD
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={ledger.pendingPayoutUSD <= 0}
            className="btn btn-emerald btn-sm"
            style={{ marginTop: '10px', width: '100%' }}
          >
            Request Payout <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="modal-overlay" onClick={() => setShowPayoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Request Localized Creator Payout</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Withdraw earnings to Uzbek National Bank Card (Uzcard / Humo) via Payme, or Click Merchant Account.
            </p>

            <form onSubmit={handleRequestPayout}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Payout Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="10"
                  max={ledger.pendingPayoutUSD}
                  className="glass-input"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  required
                />
                <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
                  Equivalent to ~{Math.round(payoutAmount * 12500).toLocaleString()} UZS
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Payout Gateway Channel
                </label>
                <select
                  className="glass-input"
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                >
                  <option value="payme">Payme / Uzbek National Card (8600 / 9860)</option>
                  <option value="click">Click Evolution Merchant Wallet</option>
                  <option value="bank">International SWIFT Bank Wire</option>
                </select>
              </div>

              {payoutMethod === 'payme' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Card Number (8600 / 9860 Uzcard/Humo)
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    value={cardDetails}
                    onChange={(e) => setCardDetails(e.target.value)}
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowPayoutModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isProcessing} className="btn btn-emerald">
                  {isProcessing ? 'Processing Payout...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout History Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="#818cf8" /> Payout & Revenue Ledger
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Account / Description</th>
                <th style={{ padding: '10px' }}>USD Amount</th>
                <th style={{ padding: '10px' }}>UZS Equivalent</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ledger.payoutHistory.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-code)' }}>{item.date}</td>
                  <td style={{ padding: '12px 10px' }}>{item.method}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 700, color: '#34d399' }}>
                    ${item.amountUSD.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>
                    {item.amountUZS.toLocaleString()} UZS
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge badge-emerald">
                      <CheckCircle2 size={10} /> {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

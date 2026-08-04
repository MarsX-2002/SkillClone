import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Smartphone, QrCode, CheckCircle2, Unlock, Calendar, Zap } from 'lucide-react';
import { StorageService } from '../services/storage.js';

export default function CheckoutModal({ isOpen, onClose, onWalletUpdated, targetAgent }) {
  if (!isOpen) return null;

  const [activeGateway, setActiveGateway] = useState('payme'); // 'payme', 'click', 'stripe'
  const [purchaseType, setPurchaseType] = useState(targetAgent ? 'unlock' : 'bundle'); // 'unlock', 'subscription', 'bundle'
  const [selectedAmountUSD, setSelectedAmountUSD] = useState(targetAgent ? (targetAgent.oneTimeUnlockUSD || 29.99) : 19.99);
  const [phoneNumber, setPhoneNumber] = useState('+998 90 123-45-67');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('input'); // 'input', 'otp', 'success'
  const [isProcessing, setIsProcessing] = useState(false);

  const amountUZS = Math.round(selectedAmountUSD * 12500);

  const handleInitiatePayme = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      if (purchaseType === 'unlock' && targetAgent) {
        StorageService.unlockAgent(targetAgent.id);
        StorageService.updateCreatorLedger(targetAgent.oneTimeUnlockUSD || 29.99);
        StorageService.addTransaction({
          type: 'one_time_unlock',
          agentName: targetAgent.name,
          gateway: activeGateway === 'payme' ? 'Payme' : activeGateway === 'click' ? 'Click' : 'Stripe / Card',
          amountUSD: targetAgent.oneTimeUnlockUSD || 29.99,
          amountUZS: Math.round((targetAgent.oneTimeUnlockUSD || 29.99) * 12500),
          creatorSplitUSD: (targetAgent.oneTimeUnlockUSD || 29.99) * 0.70,
          platformSplitUSD: (targetAgent.oneTimeUnlockUSD || 29.99) * 0.30,
          status: 'Completed'
        });
      } else if (purchaseType === 'subscription' && targetAgent) {
        StorageService.subscribeAgent(targetAgent.id);
        StorageService.updateCreatorLedger(targetAgent.monthlySubUSD || 9.99);
        StorageService.addTransaction({
          type: 'creator_subscription',
          agentName: targetAgent.name,
          gateway: activeGateway === 'payme' ? 'Payme' : activeGateway === 'click' ? 'Click' : 'Stripe / Card',
          amountUSD: targetAgent.monthlySubUSD || 9.99,
          amountUZS: Math.round((targetAgent.monthlySubUSD || 9.99) * 12500),
          creatorSplitUSD: (targetAgent.monthlySubUSD || 9.99) * 0.70,
          platformSplitUSD: (targetAgent.monthlySubUSD || 9.99) * 0.30,
          status: 'Completed'
        });
      } else {
        // Balance Top-up or Query Bundle
        StorageService.updateWalletUSD(selectedAmountUSD);
        StorageService.addTransaction({
          type: 'deposit',
          gateway: activeGateway === 'payme' ? 'Payme' : activeGateway === 'click' ? 'Click' : 'Stripe / Card',
          currency: activeGateway === 'stripe' ? 'USD' : 'UZS',
          amountUSD: selectedAmountUSD,
          amountUZS,
          status: 'Completed',
          reference: `${activeGateway.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }

      onWalletUpdated();
      setStep('success');
    }, 1200);
  };

  const resetAndClose = () => {
    setStep('input');
    setOtpCode('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>
              {targetAgent ? `Unlock ${targetAgent.name}` : 'Student Access & Prepaid Bundles'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Low-friction student pricing with Payme, Click & Cards</p>
          </div>
          <button onClick={resetAndClose} className="btn btn-secondary btn-icon"><X size={18} /></button>
        </div>

        {step === 'success' ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h3 className="gradient-text-emerald" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
              {purchaseType === 'unlock' ? 'Lifetime Access Unlocked!' : purchaseType === 'subscription' ? 'Subscription Active!' : 'Purchase Successful!'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              {targetAgent ? `You now have unlimited 1-on-1 access to ${targetAgent.name}'s expert clone.` : `Added $${selectedAmountUSD.toFixed(2)} USD to your mentorship account.`}
            </p>
            <button onClick={resetAndClose} className="btn btn-emerald" style={{ width: '100%' }}>
              Start Learning Now
            </button>
          </div>
        ) : step === 'otp' ? (
          <div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
              📲 SMS verification code sent to <strong>{phoneNumber}</strong>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Enter 6-digit Payme / Click Confirmation OTP
              </label>
              <input
                type="text"
                className="glass-input"
                placeholder="7 7 8 8 9 9"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.3em' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px', textAlign: 'center' }}>
                Simulated code: <strong>778899</strong> (Click Confirm to process)
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="btn btn-emerald"
              style={{ width: '100%', padding: '12px' }}
            >
              {isProcessing ? 'Verifying Gateway...' : `Confirm Payment of ${amountUZS.toLocaleString()} UZS`}
            </button>
          </div>
        ) : (
          <div>
            {/* Purchase Model Selector */}
            {targetAgent ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseType('unlock');
                    setSelectedAmountUSD(targetAgent.oneTimeUnlockUSD || 29.99);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: purchaseType === 'unlock' ? '2px solid #10b981' : '1px solid var(--border-glass)',
                    background: purchaseType === 'unlock' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    color: purchaseType === 'unlock' ? '#34d399' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Unlock size={14} /> One-Time Unlock
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                    ${targetAgent.oneTimeUnlockUSD || 29.99}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Buy once, own forever</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPurchaseType('subscription');
                    setSelectedAmountUSD(targetAgent.monthlySubUSD || 9.99);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: purchaseType === 'subscription' ? '2px solid #6366f1' : '1px solid var(--border-glass)',
                    background: purchaseType === 'subscription' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    color: purchaseType === 'subscription' ? '#818cf8' : 'var(--text-muted)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Creator Sub
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                    ${targetAgent.monthlySubUSD || 9.99} <span style={{ fontSize: '0.7rem' }}>/mo</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Low monthly commitment</div>
                </button>
              </div>
            ) : (
              /* Prepaid Bundles */
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Select Student Query Package
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { amt: 4.99, label: '50 Queries', sub: '$4.99' },
                    { amt: 19.99, label: 'All-Access Pass', sub: '$19.99/mo' },
                    { amt: 50.00, label: 'Institution Pack', sub: '$50.00' }
                  ].map((pkg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setPurchaseType('bundle');
                        setSelectedAmountUSD(pkg.amt);
                      }}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '10px',
                        border: selectedAmountUSD === pkg.amt ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                        background: selectedAmountUSD === pkg.amt ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: selectedAmountUSD === pkg.amt ? '#ffffff' : 'var(--text-muted)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{pkg.label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{pkg.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gateway Selector Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setActiveGateway('payme')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: activeGateway === 'payme' ? '2px solid #10b981' : '1px solid var(--border-glass)',
                  background: activeGateway === 'payme' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeGateway === 'payme' ? '#34d399' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Smartphone size={18} /> Payme (UZ)
              </button>

              <button
                type="button"
                onClick={() => setActiveGateway('click')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: activeGateway === 'click' ? '2px solid #f59e0b' : '1px solid var(--border-glass)',
                  background: activeGateway === 'click' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeGateway === 'click' ? '#fbbf24' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <QrCode size={18} /> Click (UZ)
              </button>

              <button
                type="button"
                onClick={() => setActiveGateway('stripe')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: activeGateway === 'stripe' ? '2px solid #6366f1' : '1px solid var(--border-glass)',
                  background: activeGateway === 'stripe' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeGateway === 'stripe' ? '#818cf8' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CreditCard size={18} /> Stripe / Visa
              </button>
            </div>

            {/* Gateway Specific Form */}
            {activeGateway === 'payme' && (
              <form onSubmit={handleInitiatePayme}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Payme Phone Number
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+998 90 123-45-67"
                    required
                  />
                </div>
                <button type="submit" disabled={isProcessing} className="btn btn-emerald" style={{ width: '100%', padding: '12px' }}>
                  {isProcessing ? 'Connecting to Payme API...' : `Pay ${amountUZS.toLocaleString()} UZS via Payme`}
                </button>
              </form>
            )}

            {activeGateway === 'click' && (
              <div>
                <div style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <QrCode size={90} color="#fbbf24" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scan with Click Evolution Mobile App</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
                    Amount: {amountUZS.toLocaleString()} UZS
                  </div>
                </div>
                <button onClick={handleConfirmPayment} disabled={isProcessing} className="btn btn-amber" style={{ width: '100%', padding: '12px' }}>
                  {isProcessing ? 'Processing Click Transaction...' : 'Simulate Click Merchant Pay'}
                </button>
              </div>
            )}

            {activeGateway === 'stripe' && (
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Card Number</label>
                  <input type="text" className="glass-input" defaultValue="4242 •••• •••• 4242" readOnly />
                </div>
                <button onClick={handleConfirmPayment} disabled={isProcessing} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  {isProcessing ? 'Authorizing Card...' : `Pay $${selectedAmountUSD.toFixed(2)} USD via Stripe`}
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '16px' }}>
              <ShieldCheck size={14} color="#10b981" /> 256-bit Encrypted Settlement • 70% Direct Creator Earnings
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

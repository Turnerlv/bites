import React, { useState, useRef } from 'react';
import { processWebhook } from './webhook';

export default function App() {
  const [databaseRows, setDatabaseRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // We use a ref to maintain persistent mock DB state across UI re-renders
  const mockDatabase = useRef(new Set());

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
  };

  const handleWebhookTrigger = async (forceDuplicate) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // If duplicate, use a hardcoded key, otherwise generate a random one
    const key = forceDuplicate ? "evt_stripe_9999" : `evt_${Math.floor(100000 + Math.random() * 900000)}`;

    addLog(`Triggering request event...`);
    const response = await processWebhook(key, mockDatabase.current, addLog);

    // Sync the mock DB state to the UI layout
    setDatabaseRows([...mockDatabase.current]);
    addLog(`← Response Returned: Status ${response.status} - "${response.body}"`);
    setIsProcessing(false);
  };

  const clearSystem = () => {
    mockDatabase.current.clear();
    setDatabaseRows([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', background: '#0f172a', color: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* Simulation Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => handleWebhookTrigger(false)}
          disabled={isProcessing}
          style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 14px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
        >
          {isProcessing ? 'Processing...' : '1. Send Fresh Request'}
        </button>
        <button
          onClick={() => handleWebhookTrigger(true)}
          disabled={isProcessing}
          style={{ background: '#eab308', color: '#fff', border: 'none', padding: '10px 14px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
        >
          2. Send Retry Duplicate
        </button>
        <button
          onClick={clearSystem}
          style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 14px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Reset Lab
        </button>
      </div>

      {/* Mock Database Table State */}
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: '#cbd5e1', fontSize: '14px' }}>Database Table: processed_keys</h4>
        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '12px', height: '220px', overflowY: 'auto', borderRadius: '6px', fontSize: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #475569', color: '#38bdf8', textAlign: 'left' }}>
                <th style={{ paddingBottom: '6px' }}>idempotency_key</th>
                <th style={{ paddingBottom: '6px' }}>status</th>
              </tr>
            </thead>
            <tbody>
              {databaseRows.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ color: '#475569', paddingTop: '12px' }}>No rows committed yet.</td>
                </tr>
              ) : null}
              {databaseRows.map((rowKey, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #334155', color: '#f8fafc' }}>
                  <td style={{ padding: '8px 0' }}>{rowKey}</td>
                  <td style={{ padding: '8px 0', color: '#4ade80' }}>COMMITTED</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>

  );
}
import React, { useContext, useState } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export default function BorrowLend() {
  const { 
    borrowLendTransactions, 
    addBorrowLend, 
    settleBorrowLend, 
    deleteBorrowLend,
    totalMoneyGiven,
    totalMoneyBorrowed
  } = useContext(FinanceContext);

  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    person: '',
    amount: '',
    type: 'Given',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.person && formData.amount) {
      addBorrowLend(formData);
      setFormData({
        person: '',
        amount: '',
        type: 'Given',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setIsAdding(false);
    }
  };

  const netBalance = totalMoneyGiven - totalMoneyBorrowed;

  const filteredTransactions = borrowLendTransactions.filter(t => {
    const matchesType = filterType === 'All' || t.type === filterType;
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesType && matchesStatus;
  });

  return (
    <div className="settings-content-fade">
      {/* Overview Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '32px' }}>
        <div className="stat-card">
          <h3 className="stat-title">Total Money Given</h3>
          <p className="stat-value" style={{ color: 'var(--success)' }}>₹{totalMoneyGiven.toLocaleString()}</p>
          <span className="stat-badge badge-success">To Receive</span>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Total Money Borrowed</h3>
          <p className="stat-value" style={{ color: 'var(--danger)' }}>₹{totalMoneyBorrowed.toLocaleString()}</p>
          <span className="stat-badge badge-danger">To Pay</span>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Net Balance</h3>
          <p className="stat-value" style={{ color: netBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            ₹{Math.abs(netBalance).toLocaleString()}
          </p>
          <span className={`stat-badge ${netBalance >= 0 ? 'badge-success' : 'badge-danger'}`}>
            {netBalance >= 0 ? 'Net Receivable' : 'Net Payable'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="subtitle" style={{ margin: 0 }}>Recent Records</h2>
        <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="label-text">Type</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className={`nav-item ${formData.type === 'Given' ? 'active' : ''}`}
                    style={{ flex: 1, padding: '10px' }}
                    onClick={() => setFormData({...formData, type: 'Given'})}
                  >
                    🤝 I Gave
                  </button>
                  <button 
                    type="button" 
                    className={`nav-item ${formData.type === 'Borrowed' ? 'active' : ''}`}
                    style={{ flex: 1, padding: '10px' }}
                    onClick={() => setFormData({...formData, type: 'Borrowed'})}
                  >
                    💸 I Borrowed
                  </button>
                </div>
              </div>
              <div>
                <label className="label-text">Person Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Who?" 
                  value={formData.person}
                  onChange={(e) => setFormData({...formData, person: e.target.value})}
                  required
                  style={{ marginBottom: 0 }}
                />
              </div>
              <div>
                <label className="label-text">Amount (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="How much?" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                  style={{ marginBottom: 0 }}
                />
              </div>
              <div>
                <label className="label-text">Date</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  style={{ marginBottom: 0 }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label className="label-text">Notes (Optional)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="What was it for?" 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                style={{ marginBottom: 0 }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Transaction</button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="label-text" style={{ margin: 0 }}>Type:</span>
          <select className="input-field" style={{ marginBottom: 0, padding: '6px 12px', width: 'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Given">Money Given</option>
            <option value="Borrowed">Money Borrowed</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="label-text" style={{ margin: 0 }}>Status:</span>
          <select className="input-field" style={{ marginBottom: 0, padding: '6px 12px', width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Settled">Settled</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="tx-list">
        {filteredTransactions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '16px' }}>🤝</p>
            <p>No borrow/lend records found matching filters.</p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="card" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderLeft: `4px solid ${t.type === 'Given' ? 'var(--success)' : 'var(--danger)'}`,
              opacity: t.status === 'Settled' ? 0.6 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="avatar" style={{ margin: 0 }}>
                  {t.person[0].toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{t.person}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {t.type === 'Given' ? '🤝 You lent' : '💸 You borrowed'} on {t.date}
                  </p>
                  {t.notes && <p style={{ fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>"{t.notes}"</p>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ 
                  margin: 0, 
                  fontWeight: '700', 
                  fontSize: '1.2rem',
                  color: t.type === 'Given' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {t.type === 'Given' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                  {t.status === 'Pending' ? (
                    <>
                      <button className="btn-secondary" style={{ color: 'var(--success)' }} onClick={() => settleBorrowLend(t.id)}>
                        Mark Settled
                      </button>
                      <button className="btn-secondary" onClick={() => alert('Reminder sent!')}>
                        🔔 Remind
                      </button>
                    </>
                  ) : (
                    <span className="stat-badge badge-success">Settled</span>
                  )}
                  <button className="btn-secondary" style={{ color: 'var(--danger)' }} onClick={() => deleteBorrowLend(t.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

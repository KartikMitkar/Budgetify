import React, { useContext, useState } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export default function Transactions() {
  const { expenses, deleteExpense, darkMode, setDarkMode, user } = useContext(FinanceContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(expenses.map(e => e.category.name))];

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = (exp.note || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || exp.category.name === filterCategory;
    return matchesSearch && matchesCategory;
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    deleteExpense(id);
    setConfirmDelete(null);
  };

  return (
    <div className="settings-content-fade">
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '400px', textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ marginBottom: '12px' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-primary" style={{ backgroundColor: 'var(--danger)' }} onClick={() => handleDelete(confirmDelete)}>Delete Now</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '500' }}>Search</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by note or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ width: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '500' }}>Category</label>
            <select 
              className="input-field" 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {filteredExpenses.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
            <p>No transactions found.</p>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>CATEGORY</th>
                <th>NOTE</th>
                <th>AMOUNT</th>
                <th style={{ textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td>
                    <div className="category-td-icon">
                      <span>{exp.category.icon}</span> {exp.category.name}
                    </div>
                  </td>
                  <td>{exp.note || '-'}</td>
                  <td style={{ fontWeight: '600', color: 'var(--danger)' }}>-₹{exp.amount}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => setConfirmDelete(exp.id)}
                      style={{ 
                        background: 'var(--danger-light)', 
                        color: 'var(--danger)',
                        border: 'none', 
                        cursor: 'pointer', 
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                      className="delete-btn-hover"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

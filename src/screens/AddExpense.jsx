import React, { useState, useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';
import VoiceInput from '../components/VoiceInput';

export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'travel', name: 'Travel', icon: '🚌' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'others', name: 'Others', icon: '📦' }
];

export default function AddExpense({ setCurrentScreen }) {
  const { addExpense } = useContext(FinanceContext);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    addExpense({
      amount: parseFloat(amount),
      category: category,
      date: date,
      note: note
    });
    
    setCurrentScreen('dashboard');
  };

  const handleVoiceEntries = (entries) => {
    entries.forEach(entry => {
      // Ensure the category has the full object (id, name, icon) matching our CATEGORIES if possible
      const matchedCategory = CATEGORIES.find(c => c.id === entry.category?.id) || CATEGORIES[3];
      addExpense({
        amount: parseFloat(entry.amount),
        category: matchedCategory,
        date: entry.date || new Date().toISOString().split('T')[0],
        note: entry.note || ''
      });
    });
    
    alert(`Successfully added ${entries.length} expense(s) from voice!`);
    setCurrentScreen('dashboard');
  };

  return (
    <div>
      <VoiceInput onEntriesGenerated={handleVoiceEntries} />
      
      <div className="card">
        <h3 className="subtitle" style={{ fontSize: '1rem', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>✍️ Manual Entry</h3>
        <form onSubmit={handleSubmit}>
          <label className="subtitle" style={{ fontSize: '1rem', display: 'block' }}>Amount (₹)</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="0.00" 
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            autoFocus
          />

          <label className="subtitle" style={{ fontSize: '1rem', display: 'block', marginTop: '16px' }}>Category</label>
          <div className="category-selector">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                className={`category-btn ${category.id === cat.id ? 'selected' : ''}`}
                onClick={() => setCategory(cat)}
              >
                <span>{cat.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{cat.name}</span>
              </div>
            ))}
          </div>

          <label className="subtitle" style={{ fontSize: '1rem', display: 'block', marginTop: '16px' }}>Date</label>
          <input 
            type="date" 
            className="input-field" 
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />

          <label className="subtitle" style={{ fontSize: '1rem', display: 'block', marginTop: '16px' }}>Note (Optional)</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="What was this for?" 
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <button type="submit" className="btn-primary" style={{ marginTop: '24px' }}>
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
}

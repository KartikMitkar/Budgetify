import React, { useContext, useState } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'travel', name: 'Travel', icon: '🚌' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'others', name: 'Others', icon: '📦' }
];

export default function Dashboard({ setCurrentScreen }) {
  const { budget, expenses, totalSpent, remaining, percentageUsed, darkMode, setDarkMode, user, addExpense, deleteExpense } = useContext(FinanceContext);

  // Quick Add State
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState(CATEGORIES[0]);
  const [quickNote, setQuickNote] = useState('');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickAmount || isNaN(quickAmount)) return;

    addExpense({
      amount: parseFloat(quickAmount),
      category: quickCategory,
      date: new Date().toISOString().split('T')[0],
      note: quickNote
    });

    setQuickAmount('');
    setQuickNote('');
    alert('Expense added successfully! ✨');
  };

  const recentExpenses = expenses.slice(0, 5); // show last 5

  // Grouping by category for "Saving Goals"
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category.name] = (acc[exp.category.name] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});
  
  // ... (rest of the monthly logic remains the same)
  const [activeView, setActiveView] = useState('daily');

  // Daily Spending (Last 7 days)
  const getDailyData = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const str = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({ label: str, key: d.toISOString().split('T')[0], spent: 0 });
    }
    expenses.forEach(exp => {
      const match = days.find(d => d.key === exp.date);
      if (match) match.spent += parseFloat(exp.amount);
    });
    return days;
  };

  // Weekly Spending (Last 4 weeks)
  const getWeeklyData = () => {
    const weeks = [];
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      weeks.push({ label: `Wk ${4-i}`, spent: 0, start: new Date(today.getTime() - (i+1)*7*24*60*60*1000), end: new Date(today.getTime() - i*7*24*60*60*1000) });
    }
    expenses.forEach(exp => {
      const d = new Date(exp.date);
      const match = weeks.find(w => d >= w.start && d < w.end);
      if (match) match.spent += parseFloat(exp.amount);
    });
    return weeks;
  };

  // Category Breakdown Data
  const categoryBreakdown = CATEGORIES.map(cat => ({
    label: cat.name,
    icon: cat.icon,
    spent: categoryTotals[cat.name] || 0
  })).sort((a, b) => b.spent - a.spent);

  const dailyChart = getDailyData();
  const weeklyChart = getWeeklyData();
  
  const renderChartView = () => {
    let data = [];
    let max = 1;
    let color = 'var(--primary)';

    if (activeView === 'daily') {
      data = dailyChart;
      max = Math.max(...data.map(d => d.spent), 100);
    } else if (activeView === 'weekly') {
      data = weeklyChart;
      max = Math.max(...data.map(d => d.spent), 500);
      color = '#a855f7'; // Purple for weekly
    } else {
      // Category Breakdown
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
          {categoryBreakdown.map((cat, idx) => {
            const pct = totalSpent > 0 ? (cat.spent / totalSpent) * 100 : 0;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem', width: '30px' }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                    <span>{cat.label}</span>
                    <span style={{ fontWeight: '600' }}>₹{cat.spent.toFixed(0)} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="goal-track" style={{ height: '6px' }}>
                    <div className="goal-fill" style={{ width: `${pct}%`, backgroundColor: 'var(--primary)' }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="chart-container">
        {data.map((item, idx) => {
          const pct = (item.spent / max) * 100;
          return (
            <div className="chart-bar-group" key={idx} title={`Spent: ₹${item.spent}`}>
              <div className="bar bar-spent" style={{ height: `${pct}%`, backgroundColor: color, width: '60%' }}></div>
              <span className="chart-label">{item.label}</span>
            </div>
          )
        })}
      </div>
    );
  };

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
      
      {/* 4 Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Remaining Balance</h3>
          <h2 className="stat-value">₹{remaining.toFixed(2)}</h2>
          {percentageUsed <= 100 ? (
            <span className="stat-badge badge-success">↓ {(100 - percentageUsed).toFixed(1)}% Left</span>
          ) : (
            <span className="stat-badge badge-danger">↑ {(percentageUsed - 100).toFixed(1)}% Over</span>
          )}
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Total Budget</h3>
          <h2 className="stat-value">₹{budget.toFixed(2)}</h2>
          <span className="stat-badge badge-success">Month</span>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Total Spent</h3>
          <h2 className="stat-value">₹{totalSpent.toFixed(2)}</h2>
          <span className="stat-badge badge-danger">↑ {percentageUsed.toFixed(1)}% used</span>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Transactions</h3>
          <h2 className="stat-value">{expenses.length}</h2>
          <span className="stat-badge badge-success">Overall</span>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Left Column (Insight Carousel + Recent Transactions) */}
        <div>
          <div className="card" style={{ padding: '24px 0 0 0', overflow: 'hidden' }}>
            <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Spending Insights</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setActiveView('daily')} className={`indicator ${activeView === 'daily' ? 'active' : ''}`}></button>
                <button onClick={() => setActiveView('weekly')} className={`indicator ${activeView === 'weekly' ? 'active' : ''}`}></button>
                <button onClick={() => setActiveView('category')} className={`indicator ${activeView === 'category' ? 'active' : ''}`}></button>
              </div>
            </div>

            <div 
              className="insight-scroll-container" 
              style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                scrollSnapType: 'x mandatory',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft;
                const width = e.target.offsetWidth;
                if (scrollLeft < width / 2) setActiveView('daily');
                else if (scrollLeft < width * 1.5) setActiveView('weekly');
                else setActiveView('category');
              }}
            >
              {/* Daily Slide */}
              <div className="insight-slide">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ width: '10px', height: '100%', backgroundColor: 'var(--success)', borderRadius: '50%', aspectRatio: '1/1' }}></span>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>Daily Spending This Week</h4>
                </div>
                <div style={{ display: 'flex', height: '200px', gap: '12px' }}>
                  {/* Y Axis */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', paddingBottom: '24px' }}>
                    <span>₹3,000</span>
                    <span>₹2,500</span>
                    <span>₹2,000</span>
                    <span>₹1,500</span>
                    <span>₹1,000</span>
                    <span>₹500</span>
                    <span>₹0</span>
                  </div>
                  {/* Chart Area */}
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(i+1) * 33.3}px`, borderBottom: '1px solid var(--border)', opacity: 0.3 }}></div>
                    ))}
                    
                    {dailyChart.map((item, idx) => {
                      const maxVal = 3000;
                      const pct = Math.min((item.spent / maxVal) * 100, 100);
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%', zIndex: 1 }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                            <div className="bar-premium" style={{ height: `${pct}%`, width: '24px' }} title={`₹${item.spent}`}></div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', position: 'absolute', bottom: 0 }}>{item.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Weekly Slide */}
              <div className="insight-slide">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: '#a855f7', borderRadius: '50%' }}></span>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>Weekly Performance</h4>
                </div>
                <div style={{ display: 'flex', height: '200px', gap: '12px' }}>
                  {/* Y Axis */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', paddingBottom: '24px' }}>
                    <span>₹10,000</span>
                    <span>₹8,000</span>
                    <span>₹6,000</span>
                    <span>₹4,000</span>
                    <span>₹2,000</span>
                    <span>₹0</span>
                  </div>
                  {/* Chart Area */}
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(i+1) * 40}px`, borderBottom: '1px solid var(--border)', opacity: 0.3 }}></div>
                    ))}
                    
                    {weeklyChart.map((item, idx) => {
                      const maxVal = 10000;
                      const pct = Math.min((item.spent / maxVal) * 100, 100);
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%', zIndex: 1 }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                            <div className="bar-premium" style={{ height: `${pct}%`, width: '30px', backgroundColor: '#a855f7' }} title={`₹${item.spent}`}></div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', position: 'absolute', bottom: 0 }}>{item.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Category Slide */}
              <div className="insight-slide">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>Category Breakdown</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 4px' }}>
                  {categoryBreakdown.slice(0, 4).map((cat, idx) => {
                    const pct = totalSpent > 0 ? (cat.spent / totalSpent) * 100 : 0;
                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.2rem', width: '24px' }}>{cat.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: '500' }}>{cat.label}</span>
                            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>₹{cat.spent.toFixed(0)}</span>
                          </div>
                          <div className="goal-track" style={{ height: '8px', backgroundColor: 'var(--primary-light)' }}>
                            <div className="goal-fill" style={{ width: `${pct}%`, backgroundColor: 'var(--primary)' }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="card-title" style={{ padding: '24px 24px 16px 24px', margin: 0, borderBottom: '1px solid var(--border)' }}>
              <span>Recent transactions</span>
              <button className="btn-secondary" onClick={() => setCurrentScreen('transactions')}>See all &gt;</button>
            </div>
            
            {recentExpenses.length === 0 ? (
              <p style={{ padding: '24px', opacity: 0.6 }}>No transactions yet.</p>
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
                  {recentExpenses.map(exp => (
                    <tr key={exp.id}>
                      <td>{exp.date}</td>
                      <td>
                        <div className="category-td-icon">
                          <span>{exp.category.icon}</span> {exp.category.name}
                        </div>
                      </td>
                      <td>{exp.note || '-'}</td>
                      <td style={{ fontWeight: '600' }}>-₹{exp.amount}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => setConfirmDelete(exp.id)}
                          style={{ 
                            background: 'var(--danger-light)', 
                            color: 'var(--danger)',
                            border: 'none', 
                            cursor: 'pointer', 
                            padding: '6px',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                          }}
                          className="delete-btn-hover"
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

        {/* Right Column (Quick Add + Goals) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Add Form */}
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--primary)' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>
              <span>⚡ Quick Add Expense</span>
            </div>
            <form onSubmit={handleQuickAdd}>
              <div style={{ marginBottom: '12px' }}>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Amount ₹" 
                  value={quickAmount}
                  onChange={e => setQuickAmount(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setQuickCategory(cat)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: quickCategory.id === cat.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: quickCategory.id === cat.id ? 'var(--primary-light)' : 'var(--card-bg)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.7rem'
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="What was this for? (Note)" 
                  value={quickNote}
                  onChange={e => setQuickNote(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Save Expense
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-title">
              <span>Category goals</span>
              <button className="btn-secondary" onClick={() => setCurrentScreen('analytics')}>See all &gt;</button>
            </div>
            
            <div className="goals-list">
              {Object.keys(categoryTotals).length === 0 && (
                <p style={{ opacity: 0.6 }}>No category data.</p>
              )}
              {Object.entries(categoryTotals).map(([name, sum]) => {
                const limit = budget * 0.4; // roughly assuming limit is 40% of budget for visuals
                const pct = Math.min((sum / limit) * 100, 100).toFixed(0);
                
                return (
                  <div className="goal-item" key={name}>
                    <div className="goal-header">
                      <span>{name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>₹{limit.toFixed(0)}</span>
                    </div>
                    <div className="goal-track">
                      {pct > 0 && <div className="goal-fill" style={{ width: `${pct}%` }}>{pct}%</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

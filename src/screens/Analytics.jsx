import React, { useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export default function Analytics() {
  const { expenses, totalSpent } = useContext(FinanceContext);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category.id] = (acc[exp.category.id] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const highestCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, null);

  return (
    <div>
      <h1 className="title">Spending Analysis</h1>

      <div className="card">
        <h2 className="subtitle">Category Breakdown</h2>
        {totalSpent === 0 ? (
          <p style={{ opacity: 0.6 }}>No spending data yet.</p>
        ) : (
          <div>
            {Object.entries(categoryTotals).map(([catId, amount]) => {
              const catName = expenses.find(e => e.category.id === catId).category.name;
              const catIcon = expenses.find(e => e.category.id === catId).category.icon;
              const percentage = (amount / totalSpent) * 100;
              
              return (
                <div key={catId} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '500' }}>{catIcon} {catName}</span>
                    <span style={{ fontWeight: '600' }}>₹{amount.toFixed(2)}</span>
                  </div>
                  <div className="analytics-bar-bg">
                    <div className="analytics-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="subtitle">Smart Insights 💡</h2>
        {totalSpent > 0 ? (
          <ul style={{ paddingLeft: '20px', lineHeight: '1.6', opacity: 0.8 }}>
            {highestCategory && <li>Your highest spending is on <strong>{expenses.find(e => e.category.id === highestCategory).category.name}</strong>.</li>}
            <li>Total recorded transactions: <strong>{expenses.length}</strong>.</li>
            {expenses.length > 5 && <li>Consider setting a daily limit to curb frequent expenses.</li>}
          </ul>
        ) : (
          <p style={{ opacity: 0.6 }}>Add some expenses to get smart insights.</p>
        )}
      </div>
    </div>
  );
}

import React, { useContext, useState } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export default function Rewards() {
  const { 
    points, setPoints, 
    expenses, budget, 
    remaining, totalSpent 
  } = useContext(FinanceContext);
  
  const [redeemedCodes, setRedeemedCodes] = useState([]);

  const coupons = [
    { id: 1, name: 'Amazon ₹100 Gift Card', cost: 500, icon: '📦', color: '#FF9900' },
    { id: 2, name: 'Swiggy ₹150 Voucher', cost: 750, icon: '🍔', color: '#FC8019' },
    { id: 3, name: 'Zomato ₹200 Off', cost: 1000, icon: '🍕', color: '#E23744' },
    { id: 4, name: 'Starbucks Coffee', cost: 300, icon: '☕', color: '#00704A' },
    { id: 5, name: 'BookMyShow ₹250 Off', cost: 1200, icon: '🎬', color: '#F84464' },
  ];

  const achievements = [
    { 
      id: 'first_step', 
      title: 'First Step', 
      desc: 'Added first expense', 
      icon: '⭐', 
      unlocked: expenses.length > 0 
    },
    { 
      id: 'under_budget', 
      title: 'Under Budget', 
      desc: 'Used under 50% of budget', 
      icon: '💰', 
      unlocked: totalSpent < budget * 0.5 && expenses.length > 0
    },
    { 
      id: 'super_saver', 
      title: 'Super Saver', 
      desc: 'Save over ₹2000', 
      icon: '🏆', 
      unlocked: remaining > 2000 
    },
    { 
      id: 'active_user', 
      title: 'Active User', 
      desc: 'Added 5+ transactions', 
      icon: '🔥', 
      unlocked: expenses.length >= 5 
    }
  ];

  const handleRedeem = (coupon) => {
    if (points >= coupon.cost) {
      if (window.confirm(`Redeem ${coupon.cost} points for ${coupon.name}?`)) {
        setPoints(prev => prev - coupon.cost);
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        setRedeemedCodes(prev => [...prev, { ...coupon, code, date: new Date().toLocaleDateString() }]);
        alert(`Success! Your code is: ${code}`);
      }
    } else {
      alert(`You need ${coupon.cost - points} more points to redeem this.`);
    }
  };

  const nextTierPoints = 300;
  const progress = Math.min((points / nextTierPoints) * 100, 100);

  return (
    <div className="settings-content-fade">
      {/* Rewards Hero Section */}
      <div className="card" style={{ 
        background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-hover) 100%)', 
        color: 'white', 
        textAlign: 'center',
        padding: '40px 20px',
        borderRadius: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          backgroundColor: 'rgba(255,255,255,0.15)', 
          padding: '6px 16px', 
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '20px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          ⭐ Rewards Dashboard
        </div>
        
        <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '0' }}>{points}</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '32px' }}>Credit Points</p>

        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px', fontWeight: '500' }}>
            <span>0 pts</span>
            <span>Next tier: {nextTierPoints} pts</span>
          </div>
          <div className="goal-track" style={{ backgroundColor: 'rgba(255,255,255,0.2)', height: '8px' }}>
            <div className="goal-fill" style={{ width: `${progress}%`, backgroundColor: 'white', height: '100%', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <h2 className="subtitle" style={{ marginBottom: '20px' }}>Achievements</h2>
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        overflowX: 'auto', 
        paddingBottom: '16px',
        marginBottom: '32px',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }} className="no-scrollbar">
        {achievements.map(ach => (
          <div 
            key={ach.id} 
            className="card" 
            style={{ 
              minWidth: '180px', 
              textAlign: 'center', 
              padding: '24px 16px',
              opacity: ach.unlocked ? 1 : 0.5,
              border: ach.unlocked ? '2px solid var(--success)' : '1px solid var(--border)',
              backgroundColor: ach.unlocked ? 'var(--primary-light)' : 'var(--card-bg)',
              flexShrink: 0
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
              {ach.unlocked ? ach.icon : '🔒'}
            </div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: ach.unlocked ? 'var(--primary)' : 'inherit' }}>{ach.title}</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {ach.unlocked ? ach.desc : 'Locked'}
            </p>
          </div>
        ))}
      </div>

      {/* Available Rewards */}
      <h2 className="subtitle" style={{ marginBottom: '20px' }}>Available Rewards</h2>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {coupons.map(coupon => (
          <div className="card" key={coupon.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                fontSize: '2rem', 
                width: '60px', 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: `${coupon.color}15`,
                borderRadius: '16px',
                color: coupon.color
              }}>
                {coupon.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 4px 0' }}>{coupon.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                  Costs {coupon.cost} points
                </p>
              </div>
            </div>
            <button 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                backgroundColor: points >= coupon.cost ? coupon.color : 'var(--border)',
                color: points >= coupon.cost ? 'white' : 'var(--text-secondary)',
                cursor: points >= coupon.cost ? 'pointer' : 'not-allowed'
              }}
              onClick={() => handleRedeem(coupon)}
              disabled={points < coupon.cost}
            >
              {points >= coupon.cost ? 'Redeem Now' : `${coupon.cost - points} pts needed`}
            </button>
          </div>
        ))}
      </div>

      {/* My Redeemed History */}
      {redeemedCodes.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 className="subtitle" style={{ marginBottom: '20px' }}>My Redeemed Coupons</h2>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table className="tx-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>COUPON</th>
                  <th>CODE</th>
                </tr>
              </thead>
              <tbody>
                {redeemedCodes.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.date}</td>
                    <td>{item.name}</td>
                    <td>
                      <code style={{ 
                        background: 'var(--primary-light)', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontWeight: '700',
                        color: 'var(--primary)',
                        border: '1px dashed var(--primary)'
                      }}>
                        {item.code}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

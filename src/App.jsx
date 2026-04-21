import React, { useState, useContext } from 'react';
import { FinanceProvider, FinanceContext } from './contexts/FinanceContext';
import Dashboard from './screens/Dashboard';
import AddExpense, { CATEGORIES } from './screens/AddExpense';
import Settings from './screens/Settings';
import Login from './screens/Login';
import Transactions from './screens/Transactions';
import Rewards from './screens/Rewards';
import BorrowLend from './screens/BorrowLend';
import Chatbot from './components/Chatbot';
import VoiceInput from './components/VoiceInput';

function MainApp() {
  const { 
    isAuthenticated, logout, user, darkMode, setDarkMode, 
    appSettings, setAppSettings, percentageUsed, budget, addExpense
  } = useContext(FinanceContext);
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const handleVoiceEntries = (entries) => {
    entries.forEach(entry => {
      const matchedCategory = CATEGORIES.find(c => c.id === entry.category?.id) || CATEGORIES[3];
      addExpense({
        amount: parseFloat(entry.amount),
        category: matchedCategory,
        date: entry.date || new Date().toISOString().split('T')[0],
        note: entry.note || ''
      });
    });
    alert(`Successfully added ${entries.length} expense(s) from voice!`);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const getScreenTitle = () => {
    switch(currentScreen) {
      case 'dashboard': return `Hi, ${user.firstName || 'Student'}!`;
      case 'transactions': return 'Transactions';
      case 'rewards': return 'Rewards & Coupons';
      case 'add': return 'Add Expense';
      case 'borrowLend': return 'Borrow & Lend';
      case 'settings': return 'Settings & Profile';
      default: return 'Budgetify';
    }
  };

  const getScreenSubtitle = () => {
    switch(currentScreen) {
      case 'dashboard': return "Welcome back. Here's the summary of your finances.";
      case 'transactions': return 'Full history of your spendings.';
      case 'rewards': return 'Earn points for every spending and redeem them here.';
      case 'add': return 'Log a new expense to your account.';
      case 'borrowLend': return 'Track money you gave to or borrowed from others.';
      case 'settings': return 'Manage your account preferences and security.';
      default: return '';
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div>
            <div className="sidebar-logo">
              <span>🔷</span> Budgetify
            </div>
            
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${currentScreen === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentScreen('dashboard')}
              >
                📊 Dashboard
              </button>
              <button 
                className={`nav-item ${currentScreen === 'transactions' ? 'active' : ''}`}
                onClick={() => setCurrentScreen('transactions')}
              >
                💳 Transactions
              </button>
              <button 
                className={`nav-item ${currentScreen === 'rewards' ? 'active' : ''}`}
                onClick={() => setCurrentScreen('rewards')}
              >
                ✨ Rewards
              </button>
              <button 
                className={`nav-item ${currentScreen === 'borrowLend' ? 'active' : ''}`}
                onClick={() => setCurrentScreen('borrowLend')}
              >
                🤝 Borrow & Lend
              </button>
              <button 
                className={`nav-item ${currentScreen === 'add' ? 'active' : ''}`}
                onClick={() => setCurrentScreen('add')}
              >
                ➕ Add Record
              </button>
            </nav>
          </div>

          {/* Logout button situated down at the left hand side */}
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <button className="nav-item" onClick={logout} style={{ color: 'var(--danger)', width: '100%', textAlign: 'left' }}>
              🚪 Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1 className="header-title">{getScreenTitle()}</h1>
            <p className="header-subtitle">{getScreenSubtitle()}</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn">🔔</button>
            <div 
              className="avatar" 
              onClick={() => setCurrentScreen('settings')}
              style={{ cursor: 'pointer', border: currentScreen === 'settings' ? '2px solid var(--primary)' : '1px solid var(--primary)' }}
              title="Open Settings"
            >
              {user.firstName ? `${user.firstName[0]}${user.lastName[0]}` : 'ST'}
            </div>
            <div 
              onClick={() => setCurrentScreen('settings')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.firstName} {user.lastName}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View Profile</span>
            </div>
          </div>
        </header>

        {appSettings?.notifications?.overspending && percentageUsed >= 100 && (
          <div style={{ 
            background: 'var(--danger-light)', 
            color: 'var(--danger)', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            margin: '0 24px 24px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            border: '1px solid var(--danger)'
          }}>
             <span>⚠️ <strong>Overspending Alert:</strong> You have exceeded your monthly budget of ₹{budget}.</span>
             <button 
                onClick={() => setAppSettings(prev => ({...prev, notifications: {...prev.notifications, overspending: false}}))} 
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Dismiss"
             >✕</button>
          </div>
        )}

        {currentScreen === 'dashboard' && <Dashboard setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'transactions' && <Transactions />}
        {currentScreen === 'rewards' && <Rewards />}
        {currentScreen === 'borrowLend' && <BorrowLend />}
        {currentScreen === 'add' && <AddExpense setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'settings' && <Settings />}
      </main>
      
      {currentScreen === 'dashboard' && (
        <VoiceInput variant="floating" onEntriesGenerated={handleVoiceEntries} />
      )}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}

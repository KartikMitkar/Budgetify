import React, { useContext, useState } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export default function Settings() {
  const { 
    budget, setBudget, 
    darkMode, setDarkMode, 
    largeFont, setLargeFont,
    user, setUser,
    loginHistory,
    appSettings, setAppSettings,
    logout,
    expenses
  } = useContext(FinanceContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [budgetInput, setBudgetInput] = useState(budget);

  const handleBudgetChange = (e) => {
    e.preventDefault();
    if (budgetInput && !isNaN(budgetInput)) {
      setBudget(parseFloat(budgetInput));
      alert("Budget updated successfully!");
    }
  };

  const updateSetting = (section, key, value) => {
    setAppSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const downloadCSV = () => {
    if (expenses.length === 0) {
      alert('No expenses to download.');
      return;
    }
    const headers = ['Date,Category,Amount,Note'];
    const rows = expenses.map(exp => `${exp.date},${exp.category.name},${exp.amount},"${exp.note || ''}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budgetify_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    if (expenses.length === 0) {
      alert('No expenses to download.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expenses, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "budgetify_report.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'security', label: '🔒 Security', icon: '🔒' },
    { id: 'notifications', label: '🔔 Alerts', icon: '🔔' },
    { id: 'reports', label: '📊 Reports', icon: '📊' },
    { id: 'personalization', label: '🎨 Theme', icon: '🎨' },
    { id: 'accounts', label: '🏦 Bank', icon: '🏦' },
    { id: 'activity', label: '🕒 Activity', icon: '🕒' },
    { id: 'support', label: '❓ Support', icon: '❓' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">User Profile</h2>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {user.firstName ? `${user.firstName[0]}${user.lastName[0]}` : 'ST'}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{user.firstName} {user.lastName}</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Student Plan • Active</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="label-text">First Name</label>
                  <input type="text" className="input-field" value={user.firstName} readOnly />
                </div>
                <div>
                  <label className="label-text">Last Name</label>
                  <input type="text" className="input-field" value={user.lastName} readOnly />
                </div>
              </div>
            </div>

            <h2 className="subtitle" style={{ marginTop: '32px' }}>Monthly Budget</h2>
            <div className="card">
              <form onSubmit={handleBudgetChange}>
                <label className="label-text">Set your monthly limit (₹)</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary">Update</button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">Security Settings</h2>
            <div className="card">
              <div className="setting-row">
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account.</p>
                </div>
                <button 
                  className={`btn-${appSettings.security.tfa ? 'primary' : 'secondary'}`}
                  onClick={() => updateSetting('security', 'tfa', !appSettings.security.tfa)}
                >
                  {appSettings.security.tfa ? 'Enabled' : 'Enable'}
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <h4>Biometric Login</h4>
                  <p>Use Fingerprint or Face ID to unlock the app.</p>
                </div>
                <button 
                  className={`btn-${appSettings.security.biometric ? 'primary' : 'secondary'}`}
                  onClick={() => updateSetting('security', 'biometric', !appSettings.security.biometric)}
                >
                  {appSettings.security.biometric ? 'Enabled' : 'Enable'}
                </button>
              </div>
              <div className="setting-row" style={{ borderBottom: 'none' }}>
                <div>
                  <h4>Change Password</h4>
                  <p>Update your account password regularly.</p>
                </div>
                <button className="btn-secondary" onClick={() => alert('Feature coming soon!')}>Update</button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">Notifications & Alerts</h2>
            <div className="card">
              {Object.entries(appSettings.notifications).map(([key, val]) => (
                <div className="setting-row" key={key}>
                  <div style={{ textTransform: 'capitalize' }}>
                    <h4>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <p>Get alerts for this category.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={val} 
                    onChange={() => updateSetting('notifications', key, !val)}
                    style={{ width: '20px', height: '20px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">Expense Insights & Reports</h2>
            <div className="card">
              <p>Download your financial summary in your preferred format.</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button className="btn-primary" onClick={downloadCSV}>Download CSV</button>
                <button className="btn-secondary" onClick={downloadJSON}>Download JSON</button>
              </div>
            </div>
            <div className="card" style={{ marginTop: '24px' }}>
              <h4>Weekly Summaries</h4>
              <p>Receive automated weekly spending trends in your email.</p>
              <button className="btn-secondary" style={{ marginTop: '12px' }}>Enable Weekly Emails</button>
            </div>
          </div>
        );

      case 'personalization':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">App Appearance</h2>
            <div className="card">
              <div className="setting-row">
                <div>
                  <h4>Dark Mode</h4>
                  <p>Switch between light and dark themes.</p>
                </div>
                <button className="btn-secondary" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? 'Disable' : 'Enable'}
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <h4>Large Font</h4>
                  <p>Increase text size for better readability.</p>
                </div>
                <button className="btn-secondary" onClick={() => setLargeFont(!largeFont)}>
                  {largeFont ? 'Disable' : 'Enable'}
                </button>
              </div>
              <div className="setting-row" style={{ borderBottom: 'none' }}>
                <div>
                  <h4>Category Icons</h4>
                  <p>Customize category icons and colors.</p>
                </div>
                <button className="btn-secondary" onClick={() => alert('Customization opened!')}>Customize</button>
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">Connected Accounts</h2>
            <div className="card">
              <div className="setting-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🏦</span>
                  <div>
                    <h4>Bank Linking</h4>
                    <p>Connect your bank via secure API.</p>
                  </div>
                </div>
                <button className="btn-primary">Connect</button>
              </div>
              <div className="setting-row" style={{ borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>💳</span>
                  <div>
                    <h4>UPI / Wallet</h4>
                    <p>Link your GPay, PhonePe, or Paytm.</p>
                  </div>
                </div>
                <button className="btn-primary">Link</button>
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">Login History</h2>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>DEVICE</th>
                    <th>LOCATION</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map(log => (
                    <tr key={log.id}>
                      <td>{log.date}</td>
                      <td>{log.device}</td>
                      <td>{log.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card" style={{ marginTop: '24px' }}>
              <h4>Activity Log</h4>
              <p>View history of edited or deleted entries.</p>
              <button className="btn-secondary" style={{ marginTop: '12px' }}>View Log</button>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="settings-content-fade">
            <h2 className="subtitle">Help & Support</h2>
            <div className="card">
              <div className="setting-row">
                <h4>Help & FAQ</h4>
                <button className="btn-secondary">Open</button>
              </div>
              <div className="setting-row">
                <h4>Contact Support</h4>
                <button className="btn-secondary">Contact</button>
              </div>
              <div className="setting-row">
                <h4>Feedback</h4>
                <button className="btn-secondary">Share</button>
              </div>
              <div className="setting-row" style={{ borderBottom: 'none' }}>
                <h4>About Budgetify</h4>
                <p>Version 2.4.0 (Premium)</p>
              </div>
            </div>
            <button className="btn-primary" onClick={logout} style={{ width: '100%', marginTop: '24px', backgroundColor: 'var(--danger)' }}>
              🚪 Logout
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="settings-layout">
        <aside className="settings-tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label.split(' ')[1] || tab.label}</span>
            </button>
          ))}
        </aside>

        <main className="settings-main">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

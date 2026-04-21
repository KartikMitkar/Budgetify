import React, { useState, useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export default function Login() {
  const { login, user, setUser } = useContext(FinanceContext);
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Mock check payload
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Accept any 4-digit OTP for mock verification
    if (otp.length >= 4) {
      setError('');
      // Check if user already has a name
      if (user.firstName) {
        login();
      } else {
        setStep(3);
      }
    } else {
      setError('Invalid OTP. (Hint: type any 4 digits)');
    }
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setError('Please provide your full name.');
      return;
    }
    setUser({ firstName, lastName });
    login();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px', margin: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="sidebar-logo" style={{ justifyContent: 'center', margin: '0 0 8px 0', padding: 0 }}>
            <span>🔷</span> Budgetify
          </h1>
          <p className="header-subtitle">Manage your finances smoothly.</p>
        </div>

        {error && <div className="alert alert-danger" style={{ padding: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>{error}</div>}

        {step === 1 && (
          <form onSubmit={handleInitialSubmit}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="student@university.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', marginTop: '16px' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Sign In
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <p style={{ marginBottom: '24px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              For your security, we require Two-Step Authentication. We've "sent" a verification code to <strong>{email}</strong>.
            </p>
            
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Enter Verification Code (OTP)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. 1234" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required 
              style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '4px', fontWeight: '600' }}
            />

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Verify & Login
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '12px', border: 'none' }}
              onClick={() => setStep(1)}
            >
              Back to Sign In
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleOnboardingSubmit}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Welcome!</h2>
            <p style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Let's personalize your experience.
            </p>

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>First Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Kartik" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required 
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', marginTop: '16px' }}>Last Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Mitkar" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required 
            />

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>
              Complete Setup
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

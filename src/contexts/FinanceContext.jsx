import React, { createContext, useState, useEffect } from 'react';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('budgetify_auth') === 'true';
  });

  const [budget, setBudget] = useState(() => {
    return parseFloat(localStorage.getItem('budgetify_budget')) || 5000;
  });
  
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('budgetify_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('budgetify_user');
    return saved ? JSON.parse(saved) : { firstName: '', lastName: '' };
  });

  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('budgetify_points')) || 0;
  });

  const [loginHistory, setLoginHistory] = useState(() => {
    const saved = localStorage.getItem('budgetify_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [borrowLendTransactions, setBorrowLendTransactions] = useState(() => {
    const saved = localStorage.getItem('budgetify_borrow_lend');
    return saved ? JSON.parse(saved) : [];
  });

  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('budgetify_app_settings');
    return saved ? JSON.parse(saved) : {
      notifications: { budgetLimit: true, dailyReminders: false, billReminders: true, overspending: true },
      security: { pinLock: false, biometric: true, tfa: false },
      personalization: { dashboardLayout: 'standard', categoryColors: 'vibrant' }
    };
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('budgetify_darkmode') === 'true';
  });

  const [largeFont, setLargeFont] = useState(() => {
    return localStorage.getItem('budgetify_largefont') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('budgetify_auth', isAuthenticated);
    if (isAuthenticated && loginHistory.length === 0) {
      const entry = { id: Date.now(), date: new Date().toLocaleString(), device: 'Chrome on Windows 11', location: 'Mumbai, India' };
      setLoginHistory([entry]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('budgetify_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('budgetify_points', points);
  }, [points]);

  useEffect(() => {
    localStorage.setItem('budgetify_history', JSON.stringify(loginHistory));
  }, [loginHistory]);

  useEffect(() => {
    localStorage.setItem('budgetify_app_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    localStorage.setItem('budgetify_budget', budget);
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('budgetify_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgetify_darkmode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('budgetify_largefont', largeFont);
    if (largeFont) {
      document.body.classList.add('large-font');
    } else {
      document.body.classList.remove('large-font');
    }
  }, [largeFont]);

  useEffect(() => {
    localStorage.setItem('budgetify_borrow_lend', JSON.stringify(borrowLendTransactions));
  }, [borrowLendTransactions]);

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now() };
    setExpenses(prev => [newExpense, ...prev]);
    
    // Award points: 10 points for every 100 spent (minimum 5 points)
    const pointsEarned = Math.max(5, Math.floor(parseFloat(expense.amount) / 10));
    setPoints(prev => prev + pointsEarned);
  };

  const addBorrowLend = (entry) => {
    const newEntry = { ...entry, id: Date.now(), status: 'Pending' };
    setBorrowLendTransactions(prev => [newEntry, ...prev]);
  };

  const settleBorrowLend = (id) => {
    setBorrowLendTransactions(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'Settled' } : item
    ));
  };

  const deleteBorrowLend = (id) => {
    setBorrowLendTransactions(prev => prev.filter(item => item.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const login = () => {
    setIsAuthenticated(true);
    const entry = { id: Date.now(), date: new Date().toLocaleString(), device: 'Chrome on Windows 11', location: 'Mumbai, India' };
    setLoginHistory(prev => [entry, ...prev.slice(0, 9)]); // Keep last 10
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const remaining = budget - totalSpent;
  const percentageUsed = (totalSpent / budget) * 100;

  const totalMoneyGiven = borrowLendTransactions
    .filter(t => t.type === 'Given' && t.status === 'Pending')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalMoneyBorrowed = borrowLendTransactions
    .filter(t => t.type === 'Borrowed' && t.status === 'Pending')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <FinanceContext.Provider value={{
      isAuthenticated, login, logout,
      user, setUser,
      points, setPoints,
      loginHistory, setLoginHistory,
      appSettings, setAppSettings,
      budget, setBudget,
      expenses, addExpense, deleteExpense,
      borrowLendTransactions, addBorrowLend, settleBorrowLend, deleteBorrowLend,
      totalMoneyGiven, totalMoneyBorrowed,
      totalSpent, remaining, percentageUsed,
      darkMode, setDarkMode,
      largeFont, setLargeFont
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

import React, { useState, useEffect, useRef, useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

export default function Chatbot() {
  const { expenses, budget, remaining, totalSpent, user } = useContext(FinanceContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi ${user.firstName || 'there'}! I'm your Budgetify Assistant. How can I help you manage your finances today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Logic based on app state
    setTimeout(() => {
      let response = "I'm not sure about that, but I can help you track your expenses!";
      const query = input.toLowerCase();

      if (query.includes('balance') || query.includes('how much money')) {
        response = `You have ₹${remaining.toFixed(2)} remaining in your budget of ₹${budget}.`;
      } else if (query.includes('spent') || query.includes('expense')) {
        response = `You have spent ₹${totalSpent.toFixed(2)} so far this month across ${expenses.length} transactions.`;
      } else if (query.includes('save') || query.includes('tips')) {
        response = "My top tip: Try to keep your 'Others' category below 10% of your total budget. You're doing great so far!";
      } else if (query.includes('hello') || query.includes('hi')) {
        response = `Hello ${user.firstName}! Ready to save some money today?`;
      } else if (query.includes('who are you')) {
        response = "I am your Budgetify AI, designed to help students manage their limited budgets effectively!";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Button */}
      <button 
        className={`chatbot-fab ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Budgetify AI</h4>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Online & Ready to help</span>
              </div>
            </div>
          </div>

          <div className="chatbot-messages" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                <div className={`message-bubble ${msg.role}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper assistant">
                <div className="message-bubble assistant typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <form className="chatbot-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()}>
              🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

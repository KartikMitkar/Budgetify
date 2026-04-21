import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CATEGORIES } from '../screens/AddExpense';

export default function VoiceInput({ onEntriesGenerated, variant = 'block' }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  const startListening = () => {
    setError(null);
    setTranscript('');

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser doesn't support speech recognition. Try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true; // Keep listening until manually stopped
    recognition.interimResults = true; // Show results while speaking
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Helper function to process the text
  const processTranscript = async (textToProcess) => {
    if (!textToProcess.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error("Please set your Gemini API key in the .env file");
      }

      const ai = new GoogleGenAI({ apiKey });

      const categoriesList = CATEGORIES.map(c => `{ id: "${c.id}", name: "${c.name}", icon: "${c.icon}" }`).join(', ');

      const prompt = `
        You are a financial assistant parsing spoken text into structured expense entries.
        User input: "${textToProcess}"
        
        Extract all expense entries mentioned. 
        Available categories: [${categoriesList}]
        If a category doesn't strictly match, assign the most relevant one, or "others".
        Today's date is ${new Date().toISOString().split('T')[0]}.
        Return ONLY a raw JSON array of objects, with no markdown formatting or backticks.
        Object format:
        {
          "amount": number,
          "category": { "id": string, "name": string, "icon": string },
          "date": "YYYY-MM-DD",
          "note": "string (brief description)"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      const text = response.text.trim().replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        const entries = JSON.parse(text);
        if (Array.isArray(entries) && entries.length > 0) {
          onEntriesGenerated(entries);
          setTranscript(''); // Clear on success
        } else {
          setError("Could not find any expenses in what you said.");
        }
      } catch (e) {
        console.error("Failed to parse JSON:", text);
        setError("Failed to process the response. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while communicating with the AI.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-submit after listening finishes
  useEffect(() => {
    if (!isListening && transcript && !error && !isProcessing) {
      // Small timeout to let user see final transcript before it disappears to process
      const timer = setTimeout(() => {
        processTranscript(transcript);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript, error, isProcessing]);

  if (variant === 'floating') {
    return (
      <div style={{ position: 'fixed', bottom: '30px', right: '100px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px' }}>
        {error && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', boxShadow: 'var(--shadow)', border: '1px solid var(--danger)' }}>
            ⚠️ {error}
            <button onClick={() => setError(null)} style={{ background: 'transparent', border: 'none', marginLeft: '8px', cursor: 'pointer', color: 'var(--danger)' }}>✕</button>
          </div>
        )}
        {isListening && (
          <div style={{ background: 'var(--card-bg)', padding: '8px 16px', borderRadius: '20px', boxShadow: 'var(--shadow)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
            Listening...
          </div>
        )}
        {isProcessing && (
           <div style={{ background: 'var(--card-bg)', padding: '8px 16px', borderRadius: '20px', boxShadow: 'var(--shadow)', fontSize: '0.85rem', border: '1px solid var(--border)' }}>
             Processing...
           </div>
        )}
        <button 
          className={`chatbot-fab ${isListening ? 'active' : ''}`}
          style={{ background: isListening ? 'var(--danger)' : 'var(--primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          title={isListening ? "Stop Recording" : "Voice Add Expense"}
        >
          {isListening ? '⏹️' : '🎙️'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 className="subtitle" style={{ margin: 0, fontSize: '1rem' }}>🎙️ Smart Voice Entry</h3>
        {isListening ? (
          <button type="button" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '6px 12px', fontSize: '0.85rem' }} onClick={stopListening}>
            Stop
          </button>
        ) : (
          <button type="button" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={startListening} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Start Recording'}
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '-8px', marginBottom: '16px' }}>
        Try saying: "I spent 500 rupees on food today and 200 on travel yesterday."
      </p>

      {isListening && (
        <div style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
          Listening...
        </div>
      )}

      {transcript && (
        <div style={{ padding: '12px', background: 'var(--card-bg)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '12px', minHeight: '40px', border: '1px solid var(--border)' }}>
          "{transcript}"
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '8px', padding: '8px', background: 'var(--danger-light)', borderRadius: '4px' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}


import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import './Chat.css';
import ResponseDetails from './ResponseDetails';
import { useNavigate } from 'react-router-dom';


interface Message {
  text: string;
  isUser: boolean;
  id: number;
  details?: {
    anonymizedPrompt: string;
    raw: string;
  };
}

interface AnonymizationMapping {
  type: string;
  original: string;
  anonymized: string;
}

interface ChatProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function Chat({ setIsAuthenticated }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');  // Use React Router navigation
  };

  // Suggested prompts array
  const suggestedPrompts = [
    "Draft a fraud alert email for card 4111-1111-1111-1111 belonging to John D. Smith used at IP 192.168.1.100 on 2024-03-15 14:30 in Tokyo for a $2,500 charge.",
    "Generate a patient discharge summary for Maria González treated on 03/25/2024. Include follow-up instructions directing the patient to https://healthcare.com and provide the pharmacy phone number (555) 123-4567.",
    "Create a shipping delay notification for Raj Patel indicating a $150 compensation for a delivery in Mumbai scheduled by 2024-04-05",
    "Generate a security alert for a login attempt from IP 2001:0db8:85a3:0000:0000:8a2e:0370:7334 on 2024-02-28 at 08:15 for user Alice Chen",
    "Format a PCI compliance report for a transaction using card 5500-0000-0000-0004 processed through https://payments.example.com on 2024-01-15 for an amount of $199.99.",
    "Create an onboarding checklist for new hire Dr. Emily Wong starting on 2024-06-01. Include instructions to access https://intraportal.company.com.",
    "Draft an outage notification for a network disruption in São Paulo affecting IPs 10.0.0.1 to 10.0.0.5, scheduled from 2024-05-05 at 09:00 to 11:00. Mention a $50 credit compensation",
    "Generate a customer survey request for James O'Neill offering a $25 reward via https://surveys.company.com to be completed by 2024-12-31.",
    "Create a message informing Jack that I've changed my email to emily@gmail.com."
  ];



  useEffect(() => {
    setTimeout(() => {
      const firstMessage = document.querySelector('.message');
      firstMessage?.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }, []);

  // Scroll handling useEffect
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.isUser) {
      const messageElements = document.querySelectorAll('.message');
      if (messageElements.length > 0) {
        const lastBotMessage = messageElements[messageElements.length - 1];
        lastBotMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      setMessages(prev => [
        ...prev, 
        { text: input, isUser: true, id: Date.now() }
      ]);

      const response = await axios.post<{
        response: string;
        llm_raw: string;
        llm_after_recontext: string;
        anonymized_prompt: string;
        mapping: AnonymizationMapping[];
      }>(API_URL + '/process', { prompt: input });

      setMessages(prev => [
        ...prev, 
        {
          text: response.data.response,
          isUser: false,
          id: Date.now() + 1,
          details: {
            anonymizedPrompt: response.data.anonymized_prompt,
            raw: response.data.llm_raw,
          }
        }
      ]);
    } catch (err) {
      let errorMessage = 'Failed to send message';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <div className="cyber-border"></div>
          <div className="brand-container">
            <span className="decorative-left">
              Zyn0Q9🗝️kbMz!7rfS0Gv🗝️#K!nrynLx82?f🛡️S09k%LwNj7Dbc🛡️T&AV@0qZ94e
            </span>
            <h1 className="brand-title">
              <span className="lock-icon">🔒</span>
              <span className="gradient-text">Private Prompt</span>
              <span className="lock-icon">🔒</span>
            </h1>
            <span className="decorative-right">
              JaS9Lg0m4T1G🔒HxahUbkNZ94pRnA🔒vzke?JG5rG$a~d🔑#fHS9LQhUpi🔑4T1GpRnxf
            </span>
          </div>
          <div className="cyber-border"></div>

          <div className="header-right">
            <button 
              onClick={handleLogout} 
              className="logout-button"
              aria-label="Logout"
            >
              <span className="logout-text">Logout</span>
              <span className="logout-icon">🚪</span>
            </button>
          </div>

          
        </div>
      </header>

      <div className="messages-container">
        {messages.length === 0 && !loading && (
          <div className="suggestions-container">
            <div className="intro-text">
              Take control of your privacy and use Private-Prompt.com to anonymize your AI messages!
            </div>
            <h3>Try one of these prompts or write your own:</h3>
            <div className="suggestions-list">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            {msg.details && <ResponseDetails details={msg.details} />}
            {msg.text}
            
          </div>
        ))}

        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            Generating response...
          </div>
        )}

        {/* Scroll anchor placed at the bottom of messages container */}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="chat-input"
          />
          <button type="submit" disabled={loading} className="send-button">
            <FiSend className="send-icon" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

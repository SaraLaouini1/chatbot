

import { useState, useRef, useEffect } from 'react'; // Added useRef and useEffect
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import './Chat.css';
import ResponseDetails from './ResponseDetails';


interface Message {
  text: string;
  isUser: boolean;
  id: number;
  details?: {
    anonymizedPrompt: string;
    raw: string;
    final: string;
  };
}

interface AnonymizationMapping {
  type: string;
  original: string;
  anonymized: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // New ref for scrolling
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/process';

  // Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); // Added dependency array

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
        // Add user message first
        setMessages(prev => [...prev, { 
            text: input, 
            isUser: true, 
            id: Date.now() 
        }]);

        const response = await axios.post<{
            response: string;
            llm_raw: string;
            llm_after_recontext: string;
            anonymized_prompt: string;
            mapping: AnonymizationMapping[];
        }>(API_URL, { prompt: input });

        // Then add bot response
        setMessages(prev => [...prev, {
            text: response.data.response,
            isUser: false,
            id: Date.now() + 1,
            details: {
                anonymizedPrompt: response.data.anonymized_prompt,
                raw: response.data.llm_raw,
                final: response.data.response
            }
        }]);
        
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
        <div className="title-container">
          <span className="lock-logo animated-lock" aria-hidden="true">🔒</span>
          <h1 className="chat-title">Private Prompt</h1>
        </div>
      </header>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isUser ? 'user' : 'bot'}`}
          >
            {msg.text}
            {msg.details && (
              <ResponseDetails details={msg.details} />
            )}
          </div>

        ))}
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            Generating response...
          </div>
        )}
        {/* Empty div at bottom for scrolling reference */}
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
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="chat-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="send-button"
          >
            <FiSend className="send-icon" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

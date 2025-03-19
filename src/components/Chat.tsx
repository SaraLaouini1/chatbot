import { useState } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import './Chat.css';

interface Message {
  text: string;
  isUser: boolean;
  id: number;
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

  // Vite environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/process';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      setMessages(prev => [...prev, { 
        text: input, 
        isUser: true, 
        id: Date.now() 
      }]);

      const response = await axios.post<{
        response: string;
        anonymized_prompt: string;
        mapping: AnonymizationMapping[];
      }>(API_URL, { prompt: input });

      setMessages(prev => [...prev, {
        text: response.data.response,
        isUser: false,
        id: Date.now() + 1
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

  // Keep all the existing logic, just update the JSX structure
return (
  <div className="chat-container">
    <h1 className="chat-title">Secure Chat</h1>
    
    <div className="chat-messages">
      {messages.map((msg) => (
        <div 
          key={msg.id}
          className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
        >
          <div className="message-content">
            {msg.text}
          </div>
        </div>
      ))}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          Processing...
        </div>
      )}
    </div>

    {error && (
      <div className="error-message">
        ⚠️ {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="chat-input-form">
      <div className="input-wrapper">
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
        </button>
      </div>
    </form>
  </div>
);
}

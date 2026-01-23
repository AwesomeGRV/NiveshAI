import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, TrendingUp, Shield, DollarSign, BookOpen, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    riskProfile: { type: 'moderate', score: 50 },
    age: 30,
    income: 1000000
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage = {
      id: 'welcome',
      type: 'bot',
      content: `🙏 **Welcome to NiveshAI - Your Indian Share Market Investment Advisor!**

I'm here to help you with:
- 📈 **Stock Analysis & Recommendations**
- 💰 **Mutual Fund Guidance**
- 🎯 **Portfolio Management**
- 🛡️ **Risk Assessment**
- 💳 **Tax Planning Strategies**
- 📚 **Investment Education**

Ask me anything about Indian markets, investments, or financial planning!

**Quick Start Examples:**
• Which are the best large-cap stocks for long-term investment?
• How should I start my SIP investment?
• What is the ideal asset allocation for my age?
• Which tax-saving investments should I consider?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: inputValue,
        userProfile: userProfile
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response.formatted,
        data: response.data.response.data,
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `❌ **Sorry, I encountered an error. Please try again.**

If the problem persists, it might be due to:
- Server connectivity issues
- High traffic volume
- Temporary service maintenance

Please wait a moment and try your question again.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const suggestions = [
    'Which stocks look good for long-term investment?',
    'Best mutual funds for SIP investment?',
    'How to create a diversified portfolio?',
    'Tax-saving investment options under 80C?',
    'What is my risk profile?',
    'Current market analysis and outlook?'
  ];

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-secondary-900">NiveshAI</h1>
                <p className="text-xs text-secondary-600">Indian Market Investment Advisor</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-secondary-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-64 h-full bg-white border-r border-secondary-200 transition-transform duration-300 z-20 flex flex-col`}>
          <div className="p-4 border-b border-secondary-200">
            <h3 className="font-semibold text-secondary-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 text-sm text-secondary-700 hover:text-primary-700 transition-colors">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Market Analysis
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 text-sm text-secondary-700 hover:text-primary-700 transition-colors">
                <Shield className="w-4 h-4 inline mr-2" />
                Risk Assessment
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 text-sm text-secondary-700 hover:text-primary-700 transition-colors">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Tax Planning
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 text-sm text-secondary-700 hover:text-primary-700 transition-colors">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Learning Center
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-secondary-900 mb-3">Suggested Questions</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-secondary-50 hover:bg-primary-50 text-sm text-secondary-700 hover:text-primary-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-secondary-200">
            <div className="text-xs text-secondary-600">
              <p className="mb-1">Risk Profile: <span className="font-medium capitalize">{userProfile.riskProfile.type}</span></p>
              <p>Powered by AI • Not financial advice</p>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-gradient-to-b from-slate-50 to-white">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-primary-500' : 'bg-secondary-200'}`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-secondary-600" />
                      )}
                    </div>
                    <div className={`message-bubble ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
                      {message.type === 'bot' ? (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-slide-up">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-600" />
                    </div>
                    <div className="typing-indicator">
                      <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-secondary-200 bg-white px-4 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about Indian stocks, mutual funds, portfolio management, or tax planning..."
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-chip text-xs"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

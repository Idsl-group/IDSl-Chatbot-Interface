import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';
import Sidebar from '.././components/sidebar/Sidebar.jsx';

const ChatWindow = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: 'Hello! This is a sample message from the bot.' },
    { id: 2, type: 'user', content: 'Hi! This is a sample message from the user.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to the chat
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await sendMessageToAPI(inputMessage);
      // const botMessage = {
      //   id: messages.length + 2,
      //   type: 'bot',
      //   content: response.data
      // };
      // setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window">
      {/* Sidebar */}
      <div className={`sidebar-container${sidebarOpen ? ' open' : ''}`}>
        <Sidebar onStateChange={(state) => console.log('Sidebar state:', state)} />
      </div>
      
      <div className={`main-content${sidebarOpen ? ' sidebar-open' : ''}`}>
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
          <h1 className="chat-title">Intelligent Data Science Lab</h1>
        </header>
        
        <main className="chat-body" ref={chatBodyRef}>
          {messages.map(message => (
            <div key={message.id} className={`chat-message ${message.type}-message`}>
              {message.content}
              <div className={`message-sender ${message.type}-sender`}>
                {message.type === 'user' ? 'User' : 'IDSL'}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot-message loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </main>
        
        <footer className="chat-footer">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="How can I help you today?" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="send-btn" 
            aria-label="Send"
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ChatWindow;

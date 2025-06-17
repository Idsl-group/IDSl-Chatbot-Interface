import React, { useState } from 'react';
import './ChatWindow.css';
import Sidebar from '../components/sidebar/Sidebar';

const ChatWindow = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="chat-window">
      {/* Sidebar overlay */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-content">
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>&times;</button>
          <Sidebar onStateChange={(state) => console.log('Sidebar state:', state)} />
        </div>
      </div>
      <div className="main-content">
        
        <header className="chat-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>&#9776;</button>
          <h1 className="chat-title">Intelligent Data Science Lab</h1>
        </header>
        
        <main className="chat-body">
          <div className="chat-message bot-message">Hello! This is a sample message from the bot.</div>
          <div className="chat-message user-message">Hi! This is a sample message from the user.</div>
        </main>
        
        <footer className="chat-footer">
          <input type="text" className="chat-input" placeholder="How can I help you today?" />
          <button className="send-btn" aria-label="Send">
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

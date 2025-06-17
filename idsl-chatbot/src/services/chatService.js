// Base URL for the API - replace with your actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Send a message to the chat API
 * @param {string} message - The message to send
 * @returns {Promise<Object>} The API response
 */
export const sendMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers here if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

/**
 * Get chat history from the API
 * @returns {Promise<Array>} Array of chat messages
 */
export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/history`, {
      headers: {
        // Add any authentication headers here if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    throw error;
  }
}; 
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINT } from '../utils/config';
import { v4 as uuidv4 } from 'uuid'; // Para generar identificadores únicos

const socket = io('http://localhost:4000'); // Cambia la URL si es necesario

const App = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState([])
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId")
  const company = localStorage.getItem('company');
  const token = localStorage.getItem('token');
  const headers = {
    'x-access-token': token,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINT}api/users/${userId}`, {headers:headers});
        
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        if (error.response) {
          if (error.response.status === 401) {
            // Redirect to signin page
            localStorage.clear();
            window.location.href = '/signin';
          } else if (error.response.status === 404) {
            // Navigate to 404 page
            navigate('/404');
          }
        } else {
          console.error("Network error:", error.message);
          // Handle other types of errors here
        }
      }
    };
    fetchUserData();

  }, []);
  useEffect(() => {
    // Obtener mensajes guardados del servidor
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}api/chat/${company}/messages`, { headers });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Escuchar mensajes nuevos
    socket.on('chat-message', (msg) => {
      setMessages((prevMessages) => {
        // Verificar si el mensaje ya existe en el estado local
        if (!prevMessages.some(m => m.id === msg.id)) {
          return [...prevMessages, msg];
        }
        return prevMessages;
      });
    });

    return () => {
      socket.off('chat-message');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: uuidv4(), // Generar un identificador único para cada mensaje
        content: message,
        sender: 'User', // Puedes cambiar esto según el contexto
        timestamp: new Date(),
      };

      // Emitir el mensaje al servidor
      socket.emit('chat-message', newMessage);

      // Añadir el mensaje al estado local inmediatamente
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{userData?.username}</strong>: {msg.content} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default App;

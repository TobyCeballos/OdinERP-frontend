import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { IoMdSend } from "react-icons/io";

import { API_ENDPOINT } from "../utils/config";
import { v4 as uuidv4 } from "uuid"; // Para generar identificadores únicos

const socket = io(API_ENDPOINT); // Cambia la URL si es necesario

const Chat = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId");
  const company = localStorage.getItem("company");
  const token = localStorage.getItem("token");
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const headers = {
    "x-access-token": token,
  };

  let typingTimeout;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ENDPOINT}api/users/${userId}`, {
          headers: headers,
        });

        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        if (error.response) {
          if (error.response.status === 401) {
            // Redirect to signin page
            localStorage.clear();
            window.location.href = "/signin";
          } else if (error.response.status === 404) {
            // Navigate to 404 page
            navigate("/404");
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
        const response = await axios.get(
          `${API_ENDPOINT}api/chat/${company}/messages`,
          { headers }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Escuchar mensajes nuevos
    socket.on("chat-message", (msg) => {
      setMessages((prevMessages) => {
        // Verificar si el mensaje ya existe en el estado local
        if (!prevMessages.some((m) => m.id === msg.id)) {
          return [...prevMessages, msg];
        }
        return prevMessages;
      });
    });

    return () => {
      socket.off("chat-message");
    };
  }, []);
  useEffect(() => {
    // Escuchar eventos de escritura
    socket.on("typing", (username) => {
      if (username !== userData.username) {
        setIsTyping(true);
        setTypingUser(username); // Guardar el nombre de usuario que está escribiendo
      }
    });

    socket.on("stop-typing", (username) => {
      if (username !== userData.username) {
        setIsTyping(false);
        setTypingUser(""); // Limpiar el nombre de usuario que dejó de escribir
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [userData]);

  useEffect(() => {
    // Desplazarse hacia abajo cada vez que se añadan nuevos mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: uuidv4(), // Generar un identificador único para cada mensaje
        content: message,
        sender: userData.username,
        company: company,
      };

      try {
        // Emitir el mensaje al servidor para que otros clientes puedan recibirlo
        socket.emit("chat-message", newMessage);
        setMessage("");
        // Esperar la confirmación del servidor antes de agregar el mensaje al estado local
        socket.once("chat-message-confirmation", () => {
          // Añadir el mensaje al estado local
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          socket.emit("stop-typing", userData.username);
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", userData.username); // Enviar el nombre de usuario al servidor
      clearTimeout(typingTimeout);
    } else {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit("stop-typing", userData.username); // Enviar el nombre de usuario al servidor
    }, 3000); // Tiempo de espera antes de detener el indicador de escritura
  };

  return (
    <div className="w-full h-screen pt-20 px-5 flex flex-col text-center">
      <h1 className="w-full mb-2 flex justify-between text-2xl border-b border-b-violet-500 pl-5 pb-2">
        Chat
      </h1>
      <div className="flex justify-center max-h-screen overflow-y-scroll">
        <div className="w-5/6">
          {messages.map((msg, index) => (
            <div
              className={`flex relative w-9/12 mt-3 justify-between text-white ${
                msg.sender === userData?.username
                  ? "ml-auto flex-row-reverse bg-slate-600 rounded-ee-xl rounded-s-xl"
                  : "bg-indigo-400 rounded-es-xl rounded-e-xl"
              }`}
              key={index}
            >
              <div
                className={`flex flex-col py-2 px-7 w-full max-w-full break-words ${
                  msg.sender === userData?.username ? "text-right" : "text-left"
                }`}
              >
                <strong>
                  {msg.sender === userData?.username ? "Tú" : msg.sender}
                </strong>
                <div className="font-semibold">{msg.content} </div>
              </div>

              <em
                className={`absolute flex px-7 pt-2 ${
                  msg.sender === userData?.username ? "left-0" : "right-0"
                }`}
              >
                {new Date(msg?.createdAt).toLocaleDateString()},{" "}
                {new Date(msg?.createdAt).toLocaleTimeString()}
              </em>
            </div>
          ))}
          {isTyping && (
            <div  ref={messagesEndRef} className="text-gray-500 italic">
              {typingUser} está escribiendo...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        className="w-full flex flex-row p-5"
        onSubmit={(e) => handleSendMessage(e)}
      >
        <input
          className="w-full rounded-full px-8 text-xl py-2"
          placeholder="Escribe tu mensaje..."
          type="text"
          value={message}
          onChange={(e) => handleTyping(e)}
        />
        <button
          className="ml-2 px-3 py-2 bg-violet-600 text-white rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-opacity-50"
          type="submit"
        >
          <IoMdSend className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;

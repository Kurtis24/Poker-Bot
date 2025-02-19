import { useState, useEffect, useRef } from "react";
import PokerBot from "./Components/PokerBot";
import ScrollBar from "./Components/ScrollBar";
import BetButton from "./Components/BetButton";
import "./App.css";

const App = () => {
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState([]); // ✅ Properly initialize messages as an array
  const [input, setInput] = useState("");
  const ws = useRef(null); // ✅ Use useRef to manage WebSocket without triggering re-renders

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket("ws://localhost:8080");

      ws.current.onopen = () => console.log("✅ WebSocket Connected");

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.done) {
            console.log("Python process completed");
          } else {
            setMessages((prevMessages) => [...prevMessages, data.response]);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onerror = (error) => console.error("❌ WebSocket Error:", error);
      ws.current.onclose = () => {
        console.warn("⚠️ WebSocket Disconnected. Reconnecting...");
        setTimeout(connectWebSocket, 2000); // Reconnect after 2 seconds
      };
    };

    connectWebSocket();
    return () => ws.current?.close(); // Cleanup on unmount
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    setMessages([]); // ✅ Clear previous messages before sending a new one
    ws.current.send(input);
    setInput(""); // ✅ Clear input field after sending
  };

  return (
    <div>
      <h1>React + Node.js + Python (Live Updates)</h1>

      <PokerBot />
      <ScrollBar value={value} setValue={setValue} />
      <BetButton value={value} />

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a message"
      />
      <button onClick={sendMessage} disabled={!input.trim()}>Send</button>

      <div>
        <h3>Python Responses:</h3>
        {messages.length > 0 ? (
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : (
          <p>No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default App;

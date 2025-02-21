import { useState, useEffect, useRef } from "react";
import PokerBot from "./Components/PokerBot";
import ScrollBar from "./Components/ScrollBar";
import BetButton from "./Components/BetButton";
import "./App.css";

const App = () => {
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState([]); // ✅ Store received messages
  const [input, setInput] = useState(""); // ✅ User input
  const ws = useRef(null); // ✅ WebSocket connection stored in ref

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket("ws://localhost:3030");

      ws.current.onopen = () => console.log("✅ WebSocket Connected");

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("🔹 Received from backend:", data); // ✅ Debugging
          if (data.done) {
            console.log("✅ Python process completed");
          } else {
            setMessages((prevMessages) => [...prevMessages, data.response || JSON.stringify(data)]);
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

      ws.current.onerror = (error) => console.error("❌ WebSocket Error:", error);
      ws.current.onclose = () => {
        console.warn("⚠️ WebSocket Disconnected. Reconnecting...");
        setTimeout(connectWebSocket, 2000);
      };
    };

    connectWebSocket();
    return () => ws.current?.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    setMessages((prevMessages) => [...prevMessages, `You: ${input}`]); // ✅ Show user's sent message
    ws.current.send(input);
    setInput(""); // ✅ Clear input field after sending
  };

  return (
    <div>
      <h1>React + Node.js + Python (Live Updates)</h1>

      <PokerBot />
      <ScrollBar value={value} setValue={setValue} />
      <BetButton value={value} />

      <div>
        <h3>Enter a Message:</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={!input.trim()}>Send</button>
      </div>

      <div>
        <h3>Messages:</h3>
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

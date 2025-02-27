import { useState, useEffect, useRef } from "react";
import PokerBot from "./Components/PokerBot";
import ScrollBar from "./Components/ScrollBar";
import CheckBut from "./Components/CheckBut";
import FoldBut from "./Components/FoldBut";
import BetButton from "./Components/BetButton";
import "./App.css";

const App = () => {
  const [value, setValue] = useState(0);
  const [messages, setMessages] = useState([]); // For text messages from backend
  const [images, setImages] = useState([]); // For images received from backend
  const [input, setInput] = useState(""); // User input
  const ws = useRef(null); // WebSocket connection stored in ref

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket("ws://localhost:3030");

      ws.current.onopen = () => console.log("✅ WebSocket Connected");

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("🔹 Received from backend:", data);
          
          // Append sentiment analysis or dynamic responses as messages
          if (data.sentiment_analysis) {
            setMessages((prev) => [...prev, data.sentiment_analysis]);
          } else if (data.response) {
            setMessages((prev) => [...prev, data.response]);
          } else {
            setMessages((prev) => [...prev, JSON.stringify(data)]);
          }

          // If the backend sends an array of images, update the images state.
          if (data.selected_images && Array.isArray(data.selected_images)) {
            setImages(data.selected_images);
          }

          if (data.done) {
            console.log("✅ Python process completed");
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

      ws.current.onerror = (error) =>
        console.error("❌ WebSocket Error:", error);
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
    setMessages((prev) => [...prev, `You: ${input}`]);
    ws.current.send(input);
    setInput("");
  };

  return (
    <div>
      <h1>React + Node.js + Python (Live Updates)</h1>

      <PokerBot />
      <ScrollBar value={value} setValue={setValue} />
      <BetButton value={value} />
      <CheckBut value={value} />
      <FoldBut value={value} />

      <div>
        <h3>Enter a Message:</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={!input.trim()}>
          Send
        </button>
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

      <div>
        <h3>Selected Images:</h3>
        {images.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.map((item, index) => (
              <div key={index} style={{ margin: "10px", textAlign: "center" }}>
                <img
                  src={item.image}  // This URL should be accessible (e.g., http://localhost:3000/cards/1.png)
                  alt={`Card ${item.number}`}
                  style={{ width: "150px", height: "auto" }}
                />
                <p>Card {item.number}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No images to display</p>
        )}
      </div>
    </div>
  );
};

export default App;

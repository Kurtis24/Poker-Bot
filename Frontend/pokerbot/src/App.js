import { useState, useEffect, useRef } from "react";
import ScrollBar from "./Components/ScrollBar";
import BetButton from "./Components/BetButton";
import GameControls from "./Components/GameControls"; 
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

          // If the data contains a selected image, update images state
          if (data.selected_image) {
            setImages([data.selected_image]);
          }
          // Otherwise, handle textual responses
          else if (data.sentiment_analysis) {
            setMessages((prev) => [...prev, data.sentiment_analysis]);
          } else if (data.response) {
            setMessages((prev) => [...prev, data.response]);
          } else if (data.done) {
            console.log("✅ Python process completed");
          } else {
            // Optionally ignore other messages
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
    if (
      !input.trim() ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN
    )
      return;
    setMessages((prev) => [...prev, `You: ${input}`]);
    ws.current.send(input);
    setInput("");
  };

  return (
    <div>

      <ScrollBar value={value} setValue={setValue} />
      <BetButton value={value} />
      <GameControls value={value} />

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
        {images.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.map((item, index) => (
              <div key={index} style={{ margin: "10px", textAlign: "center" }}>
                <img
                  src={item.image}  // e.g., http://localhost:3000/cards/9%20H.png
                  alt={`Card ${item.number}`}
                  style={{ width: "80px", height: "auto" }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;

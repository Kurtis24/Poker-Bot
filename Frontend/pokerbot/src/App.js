import React, { useState, useEffect, useRef } from "react";
import ScrollBar from "./Components/ScrollBar";
import GameControls from "./Components/GameControls";
import "./App.css";

const App = () => {
  const [value, setValue] = useState(0);
  const [images, setImages] = useState([]);      // [{ image, filename }]
  const [analysis, setAnalysis] = useState(null); // { round, hole_cards, strength, action, raise_amount }
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3030");

    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onerror = err => console.error("WebSocket error:", err);
    ws.current.onclose = () => console.warn("WebSocket disconnected");

    ws.current.onmessage = (evt) => {
      const raw = evt.data.toString().trim();

      // 1) Try to parse a JSON message from GTO.py
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = null;
      }

      if (payload && payload.action) {
        // got a GTO analysis payload
        setAnalysis({
          round:        payload.round,
          hole_cards:   payload.hole_cards,
          strength:     payload.strength,
          action:       payload.action,
          raise_amount: payload.raise_amount
        });
      }
      // 2) Otherwise, if it’s a simple filename string, render that card
      else if (/\.(png|jpe?g|gif)$/i.test(raw)) {
        setImages([{ image: `/cards/${raw}`, filename: raw }]);
      }
      // 3) ignore anything else
    };

    return () => ws.current.close();
  }, []);

  // send hole‐card filenames to backend
  const handleCardsDealt = (cardUrls) => {
    setImages(cardUrls.map(url => ({ image: url, filename: url.split("/").pop() })));
    if (ws.current.readyState === WebSocket.OPEN) {
      cardUrls.forEach(url => {
        const fn = url.split("/").pop();
        ws.current.send(fn);
      });
    }
  };

  // NEW: send player actions (check/fold/bet) to backend
  // GameControls will call this with (actionType, optionalBetAmount)
  const handlePlayerAction = (actionType, betAmount = 0) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type:       "player_action",
        action:     actionType,      // e.g. "check", "fold", "bet"
        bet_amount: betAmount
      }));
    }
  };

  return (
    <div>
      <ScrollBar value={value} setValue={setValue} />

      <GameControls
        value={value}
        onCardsDealt={handleCardsDealt}
        onPlayerAction={handlePlayerAction}
      />

      {/* Display the latest analysis from GTO.py */}
      {analysis && (
        <div className="analysis">
          <p>Round: {analysis.round}</p>
          <p>Hole Cards: {analysis.hole_cards.join(", ")}</p>
          <p>Strength: {analysis.strength}</p>
          <p>Action: {analysis.action}</p>
          {analysis.action === "raise" && (
            <p>Raise Amount: {analysis.raise_amount}</p>
          )}
        </div>
      )}

      {/* Display any images (in particular, the cards) */}
      {images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {images.map(({ image, filename }, i) => (
            <div key={i} style={{ margin: 10, textAlign: "center" }}>
              <img src={image} alt={filename} style={{ width: 80 }} />
              <div>{filename}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;

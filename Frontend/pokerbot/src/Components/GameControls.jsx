import React, { useState } from "react";
import "./GameControls.css"; // Import CSS file

const GameControls = () => {
  const [round, setRound] = useState(1);
  const [isEnabled, setIsEnabled] = useState(true);
  const [cardImages, setCardImages] = useState([]);

  // Returns a single random card filename, e.g. "7C.png"
  const getRandomCard = () => {
    const suits = ["C", "D", "H", "S"];
    const number = Math.floor(Math.random() * 13) + 1; // 1-13
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return `${number}${suit}.png`;
  };

  // Returns an array with 'count' random card filenames
  const getRandomCards = (count) => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      cards.push(getRandomCard());
    }
    return cards;
  };

  const handleAction = (action) => {
    // If already disabled, ignore additional clicks
    if (!isEnabled) return;

    console.log(`Player chose to ${action}.`);

    // Disable buttons briefly
    setIsEnabled(false);
    setTimeout(() => {
      setIsEnabled(true);
    }, 1000);

    // Advance the round (or reset to 1), then update cards
    setRound((prevRound) => {
      const nextRound = prevRound < 4 ? prevRound + 1 : 1;

      if (nextRound === 1) {
        // Round 1 -> clear all cards
        setCardImages([]);
      } else if (nextRound === 2) {
        // Round 2 -> show 3 new cards
        setCardImages(getRandomCards(3));
      } else if (nextRound === 3) {
        // Round 3 -> add exactly 1 more card
        setCardImages((prev) => [...prev, getRandomCard()]);
      } else if (nextRound === 4) {
        // Round 4 -> add exactly 1 more card
        setCardImages((prev) => [...prev, getRandomCard()]);
      }
      return nextRound;
    });
  };

  return (
    <div className="game-controls">
      <h2>Round: {round}</h2>

      <button
        className={`game-btn ${isEnabled ? "enabled" : "disabled"}`}
        onClick={() => handleAction("check")}
        disabled={!isEnabled}
      >
        Check
      </button>

      <button
        className={`fold-btn ${isEnabled ? "enabled" : "disabled"}`}
        onClick={() => handleAction("fold")}
        disabled={!isEnabled}
      >
        Fold
      </button>

      {/* Render the cards, if any */}
      {cardImages.length > 0 && (
        <div className="card-container">
          {cardImages.map((img, index) => (
            <img
              key={index}
              src={`./Cards/${img}`}
              alt={img}
              style={{
                width: "50px",
                height: "auto",
                margin: "5px",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameControls;

import React, { useState } from "react";
import "./GameControls.css"; // Import CSS file

const GameControls = () => {
  const [round, setRound] = useState(1);
  const [isEnabled, setIsEnabled] = useState(true);
  const [cardImages, setCardImages] = useState([]);

  // Helper function to generate 3 random card filenames
  const generateThreeRandomCards = () => {
    const suits = ["C", "D", "H", "S"];
    const newCards = [];

    for (let i = 0; i < 3; i++) {
      const number = Math.floor(Math.random() * 13) + 1; // 1-13
      const suit = suits[Math.floor(Math.random() * suits.length)]; // pick a suit
      newCards.push(`${number}${suit}.png`);
    }

    return newCards;
  };

  const handleAction = (action) => {
    console.log(`Player chose to ${action}.`);

    // Disable the buttons briefly
    setIsEnabled(false);
    setTimeout(() => {
      setIsEnabled(true);
    }, 1000);

    // Increase round; if round was 4, reset to 1
    setRound((prevRound) => {
      const nextRound = prevRound >= 4 ? 1 : prevRound + 1;

      // If the new round is 1, generate new card images
      if (nextRound === 1) {
        const randomCards = generateThreeRandomCards();
        setCardImages(randomCards);
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

      {/* Display the three random card images whenever you have them */}
      {cardImages.length > 0 && (
        <div className="card-container">
          {cardImages.map((img, index) => (
            <img
              key={index}
              src={`./Cards/${img}`} 
              alt={`${img}`}
              style={{
                width: "50px",
                height: "auto",
                margin: "5px"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameControls;

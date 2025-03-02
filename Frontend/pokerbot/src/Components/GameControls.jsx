import React, { useState } from "react";
import "./GameControls.css"; // Import CSS file

const GameControls = () => {
  const [round, setRound] = useState(1); // ✅ Track rounds
  const [isEnabled, setIsEnabled] = useState(true);

  const handleAction = (action) => {
    console.log(`Player chose to ${action}.`); // Log action

    // Disable button briefly
    setIsEnabled(false);
    setTimeout(() => {
      setIsEnabled(true);
    }, 1000);

    // Increase round, reset to 1 after round 4
    setRound((prevRound) => (prevRound >= 4 ? 1 : prevRound + 1));
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
    </div>
  );
};

export default GameControls;

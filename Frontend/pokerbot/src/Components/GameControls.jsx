// src/Components/GameControls.js
import React, { useState } from "react";
import ScrollBar from "./ScrollBar";
import "./GameControls.css";  // Import CSS file

const GameControls = ({ onCardsDealt, onPlayerAction }) => {
  const [round, setRound] = useState(1);
  const [isEnabled, setIsEnabled] = useState(true);
  const [cardImages, setCardImages] = useState([]);
  const [deck, setDeck] = useState(() => initializeDeck());
  const [betValue, setBetValue] = useState(0);

  // Initialize a full 52-card deck
  function initializeDeck() {
    const suits = ["C", "D", "H", "S"];
    const deckArr = [];
    suits.forEach((suit) => {
      for (let num = 1; num <= 13; num++) {
        deckArr.push(`${num}${suit}.png`);
      }
    });
    return deckArr;
  }

  // Draw 'count' unique cards from the deck
  function drawCards(count, currentDeck) {
    const newDeck = [...currentDeck];
    const drawn = [];
    for (let i = 0; i < count && newDeck.length > 0; i++) {
      const idx = Math.floor(Math.random() * newDeck.length);
      drawn.push(newDeck.splice(idx, 1)[0]);
    }
    return { drawn, newDeck };
  }

  const handleAction = (action) => {
    if (!isEnabled) return;
    // send the player action (no amount)
    onPlayerAction?.(action, 0);

    setIsEnabled(false);
    setTimeout(() => setIsEnabled(true), 1000);

    // If player folds, reset everything
    if (action === "fold") {
      setRound(1);
      setCardImages([]);
      setDeck(initializeDeck());
      onCardsDealt?.([]);
      return;
    }

    // Determine next round
    const nextRound = round < 4 ? round + 1 : 1;
    let newCards = [];
    let updatedDeck = [...deck];

    if (nextRound === 1) {
      // Reset deck and deal 4 new cards
      updatedDeck = initializeDeck();
      const { drawn, newDeck } = drawCards(4, updatedDeck);
      newCards = drawn;
      updatedDeck = newDeck;
    } else if (nextRound === 2) {
      // Flop: deal 3 new cards
      const { drawn, newDeck } = drawCards(3, updatedDeck);
      newCards = drawn;
      updatedDeck = newDeck;
    } else if (nextRound === 3) {
      // Turn: add 1 more card
      const { drawn, newDeck } = drawCards(1, updatedDeck);
      newCards = [...cardImages, ...drawn];
      updatedDeck = newDeck;
    } else if (nextRound === 4) {
      // River: add 1 more card
      const { drawn, newDeck } = drawCards(1, updatedDeck);
      newCards = [...cardImages, ...drawn];
      updatedDeck = newDeck;
    }

    setRound(nextRound);
    setCardImages(newCards);
    setDeck(updatedDeck);
    onCardsDealt?.(newCards);
  };

  const handleBet = () => {
    if (!isEnabled) return;
    // send the bet action with amount
    onPlayerAction?.("bet", betValue);

    setIsEnabled(false);
    setTimeout(() => setIsEnabled(true), 1000);
    console.log(`Betting ${betValue}`);
    // You can still advance rounds or keep game state logic here if desired
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

      <button
        className={`bet-btn ${isEnabled ? "enabled" : "disabled"}`}
        onClick={handleBet}
        disabled={!isEnabled}
      >
        Bet {betValue}
      </button>

      <ScrollBar value={betValue} setValue={setBetValue} />

      {cardImages.length > 0 && (
        <div className="card-container">
          {cardImages.map((img, index) => (
            <img
              key={index}
              src={`./Cards/${img}`}
              alt={img}
              style={{ width: "100px", height: "auto", margin: "5px" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameControls;

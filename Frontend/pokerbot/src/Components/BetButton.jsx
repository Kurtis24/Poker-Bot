import React from "react";
import "./BetButton.css"; // Import the CSS file

const BetButton = ({ value }) => { // ✅ Receiving value from App.js
  const handleClick = () => {
    alert(`Current Scroll Value: ${value}`);
    console.log(`Current Scroll Value: ${value}`);
  };

  return (
    <button className="value-button" onClick={handleClick}>
      Show Value ({value}) {/* ✅ Display value on button */}
    </button>
  );
};

export default BetButton;

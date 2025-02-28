import React, { useState } from "react";
import "./CheckBut.css"; // Import CSS file

const CheckButton = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleButtonClick = () => {
    setIsEnabled(false); // Disable button
    setTimeout(() => {
      setIsEnabled(true); // Enable button after 1 second
    }, 1000);
  };

  return (
    <button
      className={`check-btn ${isEnabled ? "enabled" : "disabled"}`}
      onClick={handleButtonClick}
      disabled={!isEnabled} // Disable when false
    >
      {isEnabled ? "Check" : "Please wait..."}
    </button>
  );
};

export default CheckButton;

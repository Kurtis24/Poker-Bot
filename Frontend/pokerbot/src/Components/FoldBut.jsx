import React, { useState } from "react";
import "./FoldBut.css"; // Import CSS file

const FoldBut = () => {
  const [isActive, setIsActive] = useState(true);

  const handleClick = () => {
    setIsActive(false); // Disable button
    setTimeout(() => {
      setIsActive(true); // Enable button after 1 second
    }, 1000);
  };

  return (
    <button
      className={`toggle-button ${isActive ? "active" : "disabled"}`}
      onClick={handleClick}
      disabled={!isActive} // Disable when false
    >
      {isActive ? "Fold" : "Wait..."}
    </button>
  );
};

export default FoldBut;

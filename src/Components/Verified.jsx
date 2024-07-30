import React from "react";

const Verified = () => {
  return (
    <div className="flex items-center">
      <svg
        fill="#00A000" // Set the fill color to green
        width="24px" // Adjust the size as needed
        height="24px"
        viewBox="0 0 24 24"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Verified Icon"
        className="mr-2" // Add some margin to the right for spacing
      >
        <title>Verified icon</title>
        <path
          d="M23.474,0.159L17.08,0.775c-0.406,0.039-0.844,0.383-0.978,0.768l-4.092,11.749L7.898,1.542
      C7.764,1.158,7.325,0.814,6.92,0.775L0.526,0.159C0.121,0.12-0.096,0.399,0.041,0.783L8.085,23.15
      c0.138,0.383,0.581,0.695,0.988,0.695h6.223h0.039c0.073,0,0.134-0.02,0.179-0.055c0.124-0.062,0.231-0.169,0.275-0.292
      l0.039-0.108l8.13-22.607C24.096,0.399,23.879,0.12,23.474,0.159z"
        />
      </svg>
      <span>erified</span>
    </div>
  );
};

export default Verified;

import React, { useState } from "react";

const WouldYouRather: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-6 font-custom">
        WOULD YOU RATHER
      </h1>
      <div className="flex items-center justify-center relative space-x-3">
        <div
          className={`option-box p-10 bg-custom-hot-gradient text-white text-center rounded-lg cursor-pointer transition-all duration-500 ${
            hovered === "left" ? "w-3/5" : "w-2/5"
          }`}
          onMouseEnter={() => setHovered("left")}
          onMouseLeave={() => setHovered(null)}
        >
          <p className="text-2xl font-bold font-custom">
            Be stuck on an island alone
          </p>
        </div>
        <div
          className={`absolute p-3 text-white bg-gray-900 rounded-full flex items-center justify-center transition-transform duration-500 ${
            hovered === "right"
              ? "-translate-x-16"
              : hovered === "left"
              ? "translate-x-16"
              : ""
          }`}
        >
          <p className="text-2xl font-bold font-custom">OR</p>
        </div>
        <div
          className={`option-box p-10 bg-custom-cold-gradient text-white text-center rounded-lg cursor-pointer transition-all duration-500 ${
            hovered === "right" ? "w-3/5" : "w-2/5"
          }`}
          onMouseEnter={() => setHovered("right")}
          onMouseLeave={() => setHovered(null)}
        >
          <p className="text-2xl font-bold font-custom">
            Be stuck on an island alone
          </p>
        </div>
      </div>
    </div>
  );
};

export default WouldYouRather;

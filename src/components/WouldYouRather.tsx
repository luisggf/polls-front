import React from "react";

const WouldYouRather: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6  text-white">
      <h1 className="text-4xl font-bold text-center mb-6 font-custom">
        WOULD YOU RATHER
      </h1>
      <div className="flex items-center justify-center relative space-x-3">
        <div className="w-1/2 p-10 bg-custom-hot-gradient text-white text-center rounded-lg cursor-pointer hover:bg-gray-200 ">
          <p className="text-2xl font-bold font-custom">
            Be stuck on an island alone
          </p>
        </div>
        <div className="absolute p-3 text-white bg-gray-900 rounded-full flex items-center justify-center">
          <p className="text-2xl font-bold font-custom">OR</p>
        </div>
        <div className="w-1/2 p-10 bg-custom-cold-gradient text-white text-center rounded-lg cursor-pointer hover:bg-gray-200">
          <p className="text-2xl font-bold font-custom">
            Be stuck on an island alone
          </p>
        </div>
      </div>
    </div>
  );
};

export default WouldYouRather;

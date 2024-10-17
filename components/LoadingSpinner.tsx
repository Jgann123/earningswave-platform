import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

export default LoadingSpinner;

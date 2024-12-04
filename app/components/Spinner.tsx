import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="spinner-border animate-spin border-t-4 border-teal-500 rounded-full w-16 h-16"></div>
    </div>
  );
};

export default Spinner;

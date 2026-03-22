import React from 'react';

export const LoadingScreen = ({ message = "Loading wellness data..." }) => {
  return (
    <div className="loading-container">
      <div className="loader-ball">
        <div className="inner">
          <div className="line"></div>
          <div className="line line--two"></div>
          <div className="oval"></div>
          <div className="oval oval--two"></div>
        </div>
      </div>
      <div className="loader-shadow"></div>
      <p className="mt-24 text-primary font-bold animate-pulse">{message}</p>
    </div>
  );
};

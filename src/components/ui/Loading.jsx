import React from 'react';
import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-text">Memuat...</p>
    </div>
  );
}

export default Loading;

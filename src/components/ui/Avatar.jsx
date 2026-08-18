import React from 'react';
import './Avatar.css';

function Avatar({ src, alt, size = 'medium' }) {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <div className="avatar-placeholder">
          {alt ? alt.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
}

export default Avatar;

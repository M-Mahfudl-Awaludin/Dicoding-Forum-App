import React from 'react';
import './VoteButton.css';

function VoteButton({ type, count, isActive, onClick, disabled }) {
  const isUpvote = type === 'up';
  const icon = isUpvote ? '▲' : '▼';

  const voteTypeClass = isUpvote ? 'vote-button-up' : 'vote-button-down';
  const activeClass = isActive ? 'vote-button-active' : '';

  return (
    <button
      type="button"
      className={`vote-button ${voteTypeClass} ${activeClass}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={isUpvote ? 'Upvote' : 'Downvote'}
    >
      <span className="vote-icon">{icon}</span>
      <span className="vote-count">{count}</span>
    </button>
  );
}

export default VoteButton;

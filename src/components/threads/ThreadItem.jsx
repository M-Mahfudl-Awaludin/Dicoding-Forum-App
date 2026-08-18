import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import VoteButton from '../ui/VoteButton';
import { formatDate } from '../../utils/date';
import './ThreadItem.css';

function ThreadItem({ thread, authUser, onUpVote, onDownVote }) {
  const isUpvoted = authUser && thread.upVotesBy.includes(authUser.id);
  const isDownvoted = authUser && thread.downVotesBy.includes(authUser.id);
  const voteCount = thread.upVotesBy.length - thread.downVotesBy.length;
  const bodyPreview = thread.body.length > 150
    ? `${thread.body.substring(0, 150)}...`
    : thread.body;

  return (
    <article className="thread-item">
      <div className="thread-item-votes">
        <VoteButton
          type="up"
          count={thread.upVotesBy.length}
          isActive={isUpvoted}
          onClick={() => onUpVote(thread.id)}
          disabled={!authUser}
        />
        <span className="vote-count-total">{voteCount}</span>
        <VoteButton
          type="down"
          count={thread.downVotesBy.length}
          isActive={isDownvoted}
          onClick={() => onDownVote(thread.id)}
          disabled={!authUser}
        />
      </div>
      <div className="thread-item-content">
        <div className="thread-item-header">
          <span className="thread-category">{thread.category || 'General'}</span>
          <span className="thread-date">{formatDate(thread.createdAt)}</span>
        </div>
        <Link to={`/threads/${thread.id}`} className="thread-item-link">
          <h2 className="thread-item-title">{thread.title}</h2>
        </Link>
        {bodyPreview && (
          <p className="thread-item-body">{bodyPreview}</p>
        )}
        <div className="thread-item-footer">
          <div className="thread-item-author">
            <Avatar
              src={thread.owner?.avatar}
              alt={thread.owner?.name || 'Unknown'}
              size="small"
            />
            <span className="thread-author-name">{thread.owner?.name || 'Unknown'}</span>
          </div>
          <div className="thread-item-stats">
            <span className="thread-comments-count">
              💬 {thread.totalComments || 0} komentar
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ThreadItem;

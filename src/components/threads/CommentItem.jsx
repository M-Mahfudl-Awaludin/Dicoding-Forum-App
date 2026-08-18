import React from 'react';
import Avatar from '../ui/Avatar';
import VoteButton from '../ui/VoteButton';
import { formatDate } from '../../utils/date';
import './CommentItem.css';

function CommentItem({ comment, threadId, authUser, onUpVote, onDownVote }) {
  const isUpvoted = authUser && comment.upVotesBy.includes(authUser.id);
  const isDownvoted = authUser && comment.downVotesBy.includes(authUser.id);
  const voteCount = comment.upVotesBy.length - comment.downVotesBy.length;

  return (
    <article className="comment-item">
      <div className="comment-item-votes">
        <VoteButton
          type="up"
          count={comment.upVotesBy.length}
          isActive={isUpvoted}
          onClick={() => onUpVote(threadId, comment.id)}
          disabled={!authUser}
        />
        <span className="vote-count-total">{voteCount}</span>
        <VoteButton
          type="down"
          count={comment.downVotesBy.length}
          isActive={isDownvoted}
          onClick={() => onDownVote(threadId, comment.id)}
          disabled={!authUser}
        />
      </div>
      <div className="comment-item-content">
        <div className="comment-item-header">
          <div className="comment-item-author">
            <Avatar
              src={comment.owner?.avatar}
              alt={comment.owner?.name || 'Unknown'}
              size="small"
            />
            <div className="comment-author-info">
              <span className="comment-author-name">{comment.owner?.name || 'Unknown'}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="comment-item-body">
          {comment.content}
        </div>
      </div>
    </article>
  );
}

export default CommentItem;

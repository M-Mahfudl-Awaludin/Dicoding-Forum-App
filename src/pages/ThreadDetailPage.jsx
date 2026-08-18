import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncReceiveThreadDetail,
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
} from '../state/threads/action';
import {
  asyncAddComment,
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
} from '../state/comments/action';
import Avatar from '../components/ui/Avatar';
import VoteButton from '../components/ui/VoteButton';
import CommentItem from '../components/threads/CommentItem';
import Loading from '../components/ui/Loading';
import { formatDate } from '../utils/date';
import './ThreadDetailPage.css';

function ThreadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { threadDetail, loading, error, authUser } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(id));
  }, [dispatch, id]);

  const handleUpVoteThread = () => {
    dispatch(asyncToggleUpVoteThread(id));
  };

  const handleDownVoteThread = () => {
    dispatch(asyncToggleDownVoteThread(id));
  };

  const handleUpVoteComment = (threadId, commentId) => {
    dispatch(asyncToggleUpVoteComment(threadId, commentId));
  };

  const handleDownVoteComment = (threadId, commentId) => {
    dispatch(asyncToggleDownVoteComment(threadId, commentId));
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!authUser) {
      navigate('/login');
      return;
    }

    if (!commentContent.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(asyncAddComment(id, { content: commentContent }));
      setCommentContent('');
    } catch (err) {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !threadDetail) {
    return (
      <div className="error-container">
        <p>Error: {error || 'Thread tidak ditemukan'}</p>
      </div>
    );
  }

  const isUpvoted = authUser && threadDetail.upVotesBy.includes(authUser.id);
  const isDownvoted = authUser && threadDetail.downVotesBy.includes(authUser.id);
  const voteCount = threadDetail.upVotesBy.length - threadDetail.downVotesBy.length;

  return (
    <div className="thread-detail-page">
      <div className="thread-detail-container">
        <article className="thread-detail">
          <div className="thread-detail-votes">
            <VoteButton
              type="up"
              count={threadDetail.upVotesBy.length}
              isActive={isUpvoted}
              onClick={handleUpVoteThread}
              disabled={!authUser}
            />
            <span className="vote-count-total">{voteCount}</span>
            <VoteButton
              type="down"
              count={threadDetail.downVotesBy.length}
              isActive={isDownvoted}
              onClick={handleDownVoteThread}
              disabled={!authUser}
            />
          </div>
          <div className="thread-detail-content">
            <div className="thread-detail-header">
              <span className="thread-category">{threadDetail.category || 'General'}</span>
              <span className="thread-date">{formatDate(threadDetail.createdAt)}</span>
            </div>
            <h1 className="thread-detail-title">{threadDetail.title}</h1>
            <div className="thread-detail-body">{threadDetail.body}</div>
            <div className="thread-detail-author">
              <Avatar
                src={threadDetail.owner?.avatar}
                alt={threadDetail.owner?.name || 'Unknown'}
                size="medium"
              />
              <div className="thread-author-info">
                <span className="thread-author-name">{threadDetail.owner?.name || 'Unknown'}</span>
                <span className="thread-author-label">Pembuat Thread</span>
              </div>
            </div>
          </div>
        </article>

        <section className="comments-section">
          <h2 className="comments-section-title">
            Komentar ({threadDetail.comments?.length || 0})
          </h2>

          {authUser ? (
            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Tulis komentar Anda..."
                className="comment-input"
                rows="4"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentContent.trim()}
                className="comment-submit-button"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
              </button>
            </form>
          ) : (
            <div className="comment-login-prompt">
              <p>Silakan login untuk menambahkan komentar.</p>
            </div>
          )}

          <div className="comments-list">
            {threadDetail.comments && threadDetail.comments.length > 0 ? (
              threadDetail.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  threadId={id}
                  authUser={authUser}
                  onUpVote={handleUpVoteComment}
                  onDownVote={handleDownVoteComment}
                />
              ))
            ) : (
              <div className="empty-comments">
                <p>Belum ada komentar. Jadilah yang pertama!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ThreadDetailPage;

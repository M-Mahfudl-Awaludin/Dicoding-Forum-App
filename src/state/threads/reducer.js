import { ActionType } from './action';
import { ActionType as CommentActionType } from '../comments/action';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...threads];
    case ActionType.TOGGLE_UP_VOTE_THREAD:
    case ActionType.TOGGLE_DOWN_VOTE_THREAD:
    case ActionType.TOGGLE_NEUTRAL_VOTE_THREAD: {
      const { threadId, userId } = action.payload;
      return threads.map((thread) => {
        if (thread.id === threadId) {
          let { upVotesBy, downVotesBy } = thread;
          if (action.type === ActionType.TOGGLE_UP_VOTE_THREAD) {
            upVotesBy = upVotesBy.includes(userId)
              ? upVotesBy.filter((id) => id !== userId)
              : [...upVotesBy, userId];
            downVotesBy = downVotesBy.filter((id) => id !== userId);
          } else if (action.type === ActionType.TOGGLE_DOWN_VOTE_THREAD) {
            downVotesBy = downVotesBy.includes(userId)
              ? downVotesBy.filter((id) => id !== userId)
              : [...downVotesBy, userId];
            upVotesBy = upVotesBy.filter((id) => id !== userId);
          } else {
            upVotesBy = upVotesBy.filter((id) => id !== userId);
            downVotesBy = downVotesBy.filter((id) => id !== userId);
          }
          return { ...thread, upVotesBy, downVotesBy };
        }
        return thread;
      });
    }
    default:
      return threads;
  }
}

function threadDetailReducer(threadDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREAD_DETAIL:
      return action.payload.detailThread;
    case ActionType.TOGGLE_UP_VOTE_THREAD:
    case ActionType.TOGGLE_DOWN_VOTE_THREAD:
    case ActionType.TOGGLE_NEUTRAL_VOTE_THREAD: {
      if (!threadDetail || threadDetail.id !== action.payload.threadId) {
        return threadDetail;
      }
      const { userId } = action.payload;
      let { upVotesBy, downVotesBy } = threadDetail;
      if (action.type === ActionType.TOGGLE_UP_VOTE_THREAD) {
        upVotesBy = upVotesBy.includes(userId)
          ? upVotesBy.filter((id) => id !== userId)
          : [...upVotesBy, userId];
        downVotesBy = downVotesBy.filter((id) => id !== userId);
      } else if (action.type === ActionType.TOGGLE_DOWN_VOTE_THREAD) {
        downVotesBy = downVotesBy.includes(userId)
          ? downVotesBy.filter((id) => id !== userId)
          : [...downVotesBy, userId];
        upVotesBy = upVotesBy.filter((id) => id !== userId);
      } else {
        upVotesBy = upVotesBy.filter((id) => id !== userId);
        downVotesBy = downVotesBy.filter((id) => id !== userId);
      }
      return { ...threadDetail, upVotesBy, downVotesBy };
    }
    case CommentActionType.ADD_COMMENT: {
      if (!threadDetail) {
        return threadDetail;
      }
      return {
        ...threadDetail,
        comments: [...(threadDetail.comments || []), action.payload.comment],
      };
    }
    case CommentActionType.TOGGLE_UP_VOTE_COMMENT:
    case CommentActionType.TOGGLE_DOWN_VOTE_COMMENT:
    case CommentActionType.TOGGLE_NEUTRAL_VOTE_COMMENT: {
      if (!threadDetail || threadDetail.id !== action.payload.threadId) {
        return threadDetail;
      }
      const { commentId, userId } = action.payload;
      return {
        ...threadDetail,
        comments: (threadDetail.comments || []).map((comment) => {
          if (comment.id === commentId) {
            let { upVotesBy, downVotesBy } = comment;
            if (action.type === CommentActionType.TOGGLE_UP_VOTE_COMMENT) {
              upVotesBy = upVotesBy.includes(userId)
                ? upVotesBy.filter((id) => id !== userId)
                : [...upVotesBy, userId];
              downVotesBy = downVotesBy.filter((id) => id !== userId);
            } else if (action.type === CommentActionType.TOGGLE_DOWN_VOTE_COMMENT) {
              downVotesBy = downVotesBy.includes(userId)
                ? downVotesBy.filter((id) => id !== userId)
                : [...downVotesBy, userId];
              upVotesBy = upVotesBy.filter((id) => id !== userId);
            } else {
              upVotesBy = upVotesBy.filter((id) => id !== userId);
              downVotesBy = downVotesBy.filter((id) => id !== userId);
            }
            return { ...comment, upVotesBy, downVotesBy };
          }
          return comment;
        }),
      };
    }
    default:
      return threadDetail;
  }
}

function loadingReducer(loading = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_LOADING:
      return action.payload.loading;
    default:
      return loading;
  }
}

function errorReducer(error = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_ERROR:
      return action.payload.error;
    default:
      return error;
  }
}

export {
  threadsReducer,
  threadDetailReducer,
  loadingReducer,
  errorReducer,
};

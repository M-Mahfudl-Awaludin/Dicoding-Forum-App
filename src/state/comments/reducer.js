import { ActionType } from './action';

function commentsReducer(comments = [], action = {}) {
  switch (action.type) {
    case ActionType.ADD_COMMENT:
      return [...comments, action.payload.comment];
    case ActionType.TOGGLE_UP_VOTE_COMMENT:
    case ActionType.TOGGLE_DOWN_VOTE_COMMENT:
    case ActionType.TOGGLE_NEUTRAL_VOTE_COMMENT: {
      const { commentId, userId } = action.payload;
      return comments.map((comment) => {
        if (comment.id === commentId) {
          let { upVotesBy, downVotesBy } = comment;
          if (action.type === ActionType.TOGGLE_UP_VOTE_COMMENT) {
            upVotesBy = upVotesBy.includes(userId)
              ? upVotesBy.filter((id) => id !== userId)
              : [...upVotesBy, userId];
            downVotesBy = downVotesBy.filter((id) => id !== userId);
          } else if (action.type === ActionType.TOGGLE_DOWN_VOTE_COMMENT) {
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
      });
    }
    default:
      return comments;
  }
}

export default commentsReducer;

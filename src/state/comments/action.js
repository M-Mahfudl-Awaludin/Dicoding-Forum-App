import api from '../../utils/api';

const ActionType = {
  ADD_COMMENT: 'ADD_COMMENT',
  TOGGLE_UP_VOTE_COMMENT: 'TOGGLE_UP_VOTE_COMMENT',
  TOGGLE_DOWN_VOTE_COMMENT: 'TOGGLE_DOWN_VOTE_COMMENT',
  TOGGLE_NEUTRAL_VOTE_COMMENT: 'TOGGLE_NEUTRAL_VOTE_COMMENT',
};

function addCommentAction(comment) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      comment,
    },
  };
}

function toggleUpVoteCommentAction({ threadId, commentId, userId }) {
  return {
    type: ActionType.TOGGLE_UP_VOTE_COMMENT,
    payload: {
      threadId,
      commentId,
      userId,
    },
  };
}

function toggleDownVoteCommentAction({ threadId, commentId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWN_VOTE_COMMENT,
    payload: {
      threadId,
      commentId,
      userId,
    },
  };
}

function toggleNeutralVoteCommentAction({ threadId, commentId, userId }) {
  return {
    type: ActionType.TOGGLE_NEUTRAL_VOTE_COMMENT,
    payload: {
      threadId,
      commentId,
      userId,
    },
  };
}

function asyncAddComment(threadId, { content }) {
  return async (dispatch) => {
    try {
      const response = await api.createComment(threadId, { content });
      dispatch(addCommentAction(response.data.comment));
    } catch (error) {
      throw error;
    }
  };
}

function asyncToggleUpVoteComment(threadId, commentId) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();
    if (!authUser) {
      throw new Error('You must be logged in to vote');
    }

    const comment = threadDetail?.comments.find((c) => c.id === commentId);
    if (comment?.upVotesBy.includes(authUser.id)) {
      dispatch(toggleNeutralVoteCommentAction({ threadId, commentId, userId: authUser.id }));
      try {
        await api.neutralizeCommentVote(threadId, commentId);
      } catch (error) {
        dispatch(toggleUpVoteCommentAction({ threadId, commentId, userId: authUser.id }));
        throw error;
      }
    } else {
      dispatch(toggleUpVoteCommentAction({ threadId, commentId, userId: authUser.id }));
      try {
        await api.upVoteComment(threadId, commentId);
      } catch (error) {
        if (comment?.downVotesBy.includes(authUser.id)) {
          dispatch(toggleDownVoteCommentAction({ threadId, commentId, userId: authUser.id }));
        } else {
          dispatch(toggleNeutralVoteCommentAction({ threadId, commentId, userId: authUser.id }));
        }
        throw error;
      }
    }
  };
}

function asyncToggleDownVoteComment(threadId, commentId) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();
    if (!authUser) {
      throw new Error('You must be logged in to vote');
    }

    const comment = threadDetail?.comments.find((c) => c.id === commentId);
    if (comment?.downVotesBy.includes(authUser.id)) {
      dispatch(toggleNeutralVoteCommentAction({ threadId, commentId, userId: authUser.id }));
      try {
        await api.neutralizeCommentVote(threadId, commentId);
      } catch (error) {
        dispatch(toggleDownVoteCommentAction({ threadId, commentId, userId: authUser.id }));
        throw error;
      }
    } else {
      dispatch(toggleDownVoteCommentAction({ threadId, commentId, userId: authUser.id }));
      try {
        await api.downVoteComment(threadId, commentId);
      } catch (error) {
        if (comment?.upVotesBy.includes(authUser.id)) {
          dispatch(toggleUpVoteCommentAction({ threadId, commentId, userId: authUser.id }));
        } else {
          dispatch(toggleNeutralVoteCommentAction({ threadId, commentId, userId: authUser.id }));
        }
        throw error;
      }
    }
  };
}

export {
  ActionType,
  addCommentAction,
  asyncAddComment,
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
};

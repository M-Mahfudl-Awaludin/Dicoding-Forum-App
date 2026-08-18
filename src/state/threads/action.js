import api from '../../utils/api';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_UP_VOTE_THREAD: 'TOGGLE_UP_VOTE_THREAD',
  TOGGLE_DOWN_VOTE_THREAD: 'TOGGLE_DOWN_VOTE_THREAD',
  TOGGLE_NEUTRAL_VOTE_THREAD: 'TOGGLE_NEUTRAL_VOTE_THREAD',
};

function receiveThreadsAction(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

function addThreadAction(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

function receiveThreadDetailAction(detailThread) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      detailThread,
    },
  };
}

function setLoadingAction(loading) {
  return {
    type: ActionType.SET_LOADING,
    payload: {
      loading,
    },
  };
}

function setErrorAction(error) {
  return {
    type: ActionType.SET_ERROR,
    payload: {
      error,
    },
  };
}

function toggleUpVoteThreadAction({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_UP_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function toggleDownVoteThreadAction({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_DOWN_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function toggleNeutralVoteThreadAction({ threadId, userId }) {
  return {
    type: ActionType.TOGGLE_NEUTRAL_VOTE_THREAD,
    payload: {
      threadId,
      userId,
    },
  };
}

function asyncReceiveThreads() {
  return async (dispatch) => {
    dispatch(setLoadingAction(true));
    dispatch(setErrorAction(null));
    try {
      const response = await api.getAllThreads();
      dispatch(receiveThreadsAction(response.data.threads));
    } catch (error) {
      dispatch(setErrorAction(error.message));
    } finally {
      dispatch(setLoadingAction(false));
    }
  };
}

function asyncAddThread({ title, body, category }) {
  return async (dispatch) => {
    try {
      const response = await api.createThread({ title, body, category });
      dispatch(addThreadAction(response.data.thread));
      return response.data.thread;
    } catch (error) {
      throw error;
    }
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(setLoadingAction(true));
    dispatch(setErrorAction(null));
    try {
      const response = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetailAction(response.data.detailThread));
    } catch (error) {
      dispatch(setErrorAction(error.message));
    } finally {
      dispatch(setLoadingAction(false));
    }
  };
}

function asyncToggleUpVoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) {
      throw new Error('You must be logged in to vote');
    }

    const { threads, threadDetail } = getState();
    const thread = threads.find((t) => t.id === threadId) || threadDetail;

    if (thread?.upVotesBy.includes(authUser.id)) {
      dispatch(toggleNeutralVoteThreadAction({ threadId, userId: authUser.id }));
      try {
        await api.neutralizeThreadVote(threadId);
      } catch (error) {
        dispatch(toggleUpVoteThreadAction({ threadId, userId: authUser.id }));
        throw error;
      }
    } else {
      dispatch(toggleUpVoteThreadAction({ threadId, userId: authUser.id }));
      try {
        await api.upVoteThread(threadId);
      } catch (error) {
        if (thread?.downVotesBy.includes(authUser.id)) {
          dispatch(toggleDownVoteThreadAction({ threadId, userId: authUser.id }));
        } else {
          dispatch(toggleNeutralVoteThreadAction({ threadId, userId: authUser.id }));
        }
        throw error;
      }
    }
  };
}

function asyncToggleDownVoteThread(threadId) {
  return async (dispatch, getState) => {
    const { authUser } = getState();
    if (!authUser) {
      throw new Error('You must be logged in to vote');
    }

    const { threads, threadDetail } = getState();
    const thread = threads.find((t) => t.id === threadId) || threadDetail;

    if (thread?.downVotesBy.includes(authUser.id)) {
      dispatch(toggleNeutralVoteThreadAction({ threadId, userId: authUser.id }));
      try {
        await api.neutralizeThreadVote(threadId);
      } catch (error) {
        dispatch(toggleDownVoteThreadAction({ threadId, userId: authUser.id }));
        throw error;
      }
    } else {
      dispatch(toggleDownVoteThreadAction({ threadId, userId: authUser.id }));
      try {
        await api.downVoteThread(threadId);
      } catch (error) {
        if (thread?.upVotesBy.includes(authUser.id)) {
          dispatch(toggleUpVoteThreadAction({ threadId, userId: authUser.id }));
        } else {
          dispatch(toggleNeutralVoteThreadAction({ threadId, userId: authUser.id }));
        }
        throw error;
      }
    }
  };
}

export {
  ActionType,
  receiveThreadsAction,
  addThreadAction,
  receiveThreadDetailAction,
  setLoadingAction,
  setErrorAction,
  asyncReceiveThreads,
  asyncAddThread,
  asyncReceiveThreadDetail,
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
};

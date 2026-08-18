import api from '../../utils/api';

const ActionType = {
  RECEIVE_LEADERBOARDS: 'RECEIVE_LEADERBOARDS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

function receiveLeaderboardsAction(leaderboards) {
  return {
    type: ActionType.RECEIVE_LEADERBOARDS,
    payload: {
      leaderboards,
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

function asyncReceiveLeaderboards() {
  return async (dispatch) => {
    dispatch(setLoadingAction(true));
    dispatch(setErrorAction(null));
    try {
      const response = await api.getLeaderboards();
      dispatch(receiveLeaderboardsAction(response.data.leaderboards));
    } catch (error) {
      dispatch(setErrorAction(error.message));
    } finally {
      dispatch(setLoadingAction(false));
    }
  };
}

export {
  ActionType,
  receiveLeaderboardsAction,
  setLoadingAction,
  setErrorAction,
  asyncReceiveLeaderboards,
};

import { ActionType } from './action';

function leaderboardsReducer(leaderboards = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_LEADERBOARDS:
      return action.payload.leaderboards;
    default:
      return leaderboards;
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
  leaderboardsReducer,
  loadingReducer,
  errorReducer,
};

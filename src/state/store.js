import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './auth/reducer';
import {
  threadsReducer,
  threadDetailReducer,
  loadingReducer,
  errorReducer,
} from './threads/reducer';
import commentsReducer from './comments/reducer';
import usersReducer from './users/reducer';
import {
  leaderboardsReducer,
  loadingReducer as leaderboardsLoadingReducer,
  errorReducer as leaderboardsErrorReducer,
} from './leaderboards/reducer';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    loading: loadingReducer,
    error: errorReducer,
    comments: commentsReducer,
    users: usersReducer,
    leaderboards: leaderboardsReducer,
    leaderboardsLoading: leaderboardsLoadingReducer,
    leaderboardsError: leaderboardsErrorReducer,
  },
});

export default store;

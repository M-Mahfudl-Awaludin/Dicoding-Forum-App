import { leaderboardsReducer, loadingReducer, errorReducer } from './reducer';
import { ActionType } from './action';

describe('leaderboardsReducer', () => {
  it('should return the initial state ([]) when given by unknown action', () => {
    expect(leaderboardsReducer(undefined, { type: 'UNKNOWN' })).toEqual([]);
  });

  it('should return the leaderboards when given RECEIVE_LEADERBOARDS action', () => {
    const leaderboards = [
      { user: { id: 'user-1', name: 'John' }, score: 10 },
      { user: { id: 'user-2', name: 'Jane' }, score: 5 },
    ];
    const action = {
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards },
    };

    expect(leaderboardsReducer([], action)).toEqual(leaderboards);
  });
});

describe('loadingReducer (leaderboards)', () => {
  it('should return false as the initial state', () => {
    expect(loadingReducer(undefined, { type: 'UNKNOWN' })).toEqual(false);
  });

  it('should toggle loading state when given SET_LOADING action', () => {
    expect(loadingReducer(false, {
      type: ActionType.SET_LOADING,
      payload: { loading: true },
    })).toEqual(true);
  });
});

describe('errorReducer (leaderboards)', () => {
  it('should return the error message when given SET_ERROR action', () => {
    expect(errorReducer(null, {
      type: ActionType.SET_ERROR,
      payload: { error: 'Failed to fetch' },
    })).toEqual('Failed to fetch');
  });
});

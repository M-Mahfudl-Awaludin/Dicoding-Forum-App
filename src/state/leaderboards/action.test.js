import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import api from '../../utils/api';
import { ActionType, asyncReceiveLeaderboards } from './action';

jest.mock('../../utils/api');

const mockStore = configureMockStore([thunk]);

describe('asyncReceiveLeaderboards thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch loading, receive data, and stop loading on success', async () => {
    const leaderboards = [{ user: { id: 'user-1', name: 'John' }, score: 10 }];
    api.getLeaderboards.mockResolvedValue({ data: { leaderboards } });

    const store = mockStore({});
    await store.dispatch(asyncReceiveLeaderboards());
    const actions = store.getActions();

    expect(actions[0]).toEqual({ type: ActionType.SET_LOADING, payload: { loading: true } });
    expect(actions[2]).toEqual({
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards },
    });
    expect(actions[3]).toEqual({ type: ActionType.SET_LOADING, payload: { loading: false } });
  });

  it('should dispatch an error action when the fetch fails', async () => {
    api.getLeaderboards.mockRejectedValue(new Error('Failed to fetch leaderboards'));

    const store = mockStore({});
    await store.dispatch(asyncReceiveLeaderboards());

    expect(store.getActions()).toContainEqual({
      type: ActionType.SET_ERROR,
      payload: { error: 'Failed to fetch leaderboards' },
    });
  });
});

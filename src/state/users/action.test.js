import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import api from '../../utils/api';
import { ActionType, asyncReceiveUsers } from './action';

jest.mock('../../utils/api');

const mockStore = configureMockStore([thunk]);

describe('asyncReceiveUsers thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch RECEIVE_USERS when the request succeeds', async () => {
    const users = [{ id: 'user-1', name: 'John', avatar: 'john.png' }];
    api.getAllUsers.mockResolvedValue({ data: { users } });

    const store = mockStore({});
    await store.dispatch(asyncReceiveUsers());

    expect(store.getActions()).toEqual([
      { type: ActionType.RECEIVE_USERS, payload: { users } },
    ]);
  });

  it('should not dispatch anything or throw when the request fails', async () => {
    api.getAllUsers.mockRejectedValue(new Error('Network error'));

    const store = mockStore({});
    await expect(store.dispatch(asyncReceiveUsers())).resolves.not.toThrow();

    expect(store.getActions()).toHaveLength(0);
  });
});

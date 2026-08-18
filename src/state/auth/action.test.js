import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import api from '../../utils/api';
import {
  ActionType,
  asyncSetAuthUser,
  asyncRegisterUser,
  asyncUnsetAuthUser,
  asyncGetOwnProfile,
} from './action';

jest.mock('../../utils/api');

const mockStore = configureMockStore([thunk]);

describe('asyncSetAuthUser thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should store the token and dispatch SET_AUTH_USER when login succeeds', async () => {
    api.login.mockResolvedValue({ data: { token: 'token-123' } });
    api.getOwnProfile.mockResolvedValue({ data: { user: { id: 'user-1', name: 'John' } } });

    const store = mockStore({});
    await store.dispatch(asyncSetAuthUser({ email: 'john@example.com', password: 'secret12' }));
    const actions = store.getActions();

    expect(localStorage.getItem('token')).toEqual('token-123');
    expect(actions).toEqual([
      {
        type: ActionType.SET_AUTH_USER,
        payload: { authUser: { id: 'user-1', name: 'John' } },
      },
    ]);
  });

  it('should throw and dispatch nothing when login fails', async () => {
    api.login.mockRejectedValue(new Error('Wrong email or password'));

    const store = mockStore({});

    await expect(store.dispatch(asyncSetAuthUser({ email: 'x', password: 'y' })))
      .rejects.toThrow('Wrong email or password');
    expect(store.getActions()).toHaveLength(0);
    expect(localStorage.getItem('token')).toBeNull();
  });
});

describe('asyncRegisterUser thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should register, then login, then dispatch SET_AUTH_USER on success', async () => {
    api.register.mockResolvedValue({ data: {} });
    api.login.mockResolvedValue({ data: { token: 'token-456' } });
    api.getOwnProfile.mockResolvedValue({ data: { user: { id: 'user-2', name: 'Jane' } } });

    const store = mockStore({});
    const newUser = { name: 'Jane', email: 'jane@example.com', password: 'secret12' };
    await store.dispatch(asyncRegisterUser(newUser));

    expect(api.register).toHaveBeenCalledWith(newUser);
    expect(store.getActions()).toEqual([
      {
        type: ActionType.SET_AUTH_USER,
        payload: { authUser: { id: 'user-2', name: 'Jane' } },
      },
    ]);
  });

  it('should throw when registration fails and never call login', async () => {
    api.register.mockRejectedValue(new Error('Email already used'));

    const store = mockStore({});

    await expect(store.dispatch(asyncRegisterUser({ name: 'x', email: 'y', password: 'z' })))
      .rejects.toThrow('Email already used');
    expect(api.login).not.toHaveBeenCalled();
  });
});

describe('asyncUnsetAuthUser thunk', () => {
  it('should remove the token from localStorage and dispatch UNSET_AUTH_USER', () => {
    localStorage.setItem('token', 'token-123');
    const store = mockStore({});

    store.dispatch(asyncUnsetAuthUser());

    expect(localStorage.getItem('token')).toBeNull();
    expect(store.getActions()).toEqual([{ type: ActionType.UNSET_AUTH_USER }]);
  });
});

describe('asyncGetOwnProfile thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should dispatch SET_AUTH_USER when the profile request succeeds', async () => {
    api.getOwnProfile.mockResolvedValue({ data: { user: { id: 'user-1', name: 'John' } } });
    const store = mockStore({});

    await store.dispatch(asyncGetOwnProfile());

    expect(store.getActions()).toEqual([
      { type: ActionType.SET_AUTH_USER, payload: { authUser: { id: 'user-1', name: 'John' } } },
    ]);
  });

  it('should clear the token and dispatch UNSET_AUTH_USER when the request fails', async () => {
    localStorage.setItem('token', 'stale-token');
    api.getOwnProfile.mockRejectedValue(new Error('Unauthorized'));
    const store = mockStore({});

    await store.dispatch(asyncGetOwnProfile());

    expect(localStorage.getItem('token')).toBeNull();
    expect(store.getActions()).toEqual([{ type: ActionType.UNSET_AUTH_USER }]);
  });
});

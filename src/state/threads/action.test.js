import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import api from '../../utils/api';
import {
  ActionType,
  asyncReceiveThreads,
  asyncAddThread,
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
} from './action';

jest.mock('../../utils/api');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('asyncReceiveThreads thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch loading, receive data, and stop loading on success', async () => {
    const threads = [{ id: 'thread-1', title: 'Thread 1' }];
    api.getAllThreads.mockResolvedValue({ data: { threads } });

    const store = mockStore({});
    await store.dispatch(asyncReceiveThreads());
    const actions = store.getActions();

    expect(actions[0]).toEqual({ type: ActionType.SET_LOADING, payload: { loading: true } });
    expect(actions[1]).toEqual({ type: ActionType.SET_ERROR, payload: { error: null } });
    expect(actions[2]).toEqual({ type: ActionType.RECEIVE_THREADS, payload: { threads } });
    expect(actions[3]).toEqual({ type: ActionType.SET_LOADING, payload: { loading: false } });
  });

  it('should dispatch an error action and stop loading when the fetch fails', async () => {
    api.getAllThreads.mockRejectedValue(new Error('Network error'));

    const store = mockStore({});
    await store.dispatch(asyncReceiveThreads());
    const actions = store.getActions();

    expect(actions).toContainEqual({
      type: ActionType.SET_ERROR,
      payload: { error: 'Network error' },
    });
    expect(actions[actions.length - 1]).toEqual({
      type: ActionType.SET_LOADING,
      payload: { loading: false },
    });
  });
});

describe('asyncAddThread thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch ADD_THREAD and return the created thread on success', async () => {
    const thread = { id: 'thread-1', title: 'New Thread' };
    api.createThread.mockResolvedValue({ data: { thread } });

    const store = mockStore({});
    const result = await store.dispatch(asyncAddThread({ title: 'New Thread', body: 'Body' }));
    const actions = store.getActions();

    expect(actions).toContainEqual({ type: ActionType.ADD_THREAD, payload: { thread } });
    expect(result).toEqual(thread);
  });

  it('should throw and not dispatch ADD_THREAD when the request fails', async () => {
    api.createThread.mockRejectedValue(new Error('Failed to create thread'));

    const store = mockStore({});

    await expect(store.dispatch(asyncAddThread({ title: 'x', body: 'y' })))
      .rejects.toThrow('Failed to create thread');
    expect(store.getActions()).toHaveLength(0);
  });
});

describe('asyncToggleUpVoteThread thunk (complex, multi-dispatch)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should optimistically dispatch TOGGLE_UP_VOTE_THREAD then call the API', async () => {
    api.upVoteThread.mockResolvedValue({ data: {} });
    const state = {
      authUser: { id: 'user-1' },
      threads: [{
        id: 'thread-1', upVotesBy: [], downVotesBy: [],
      }],
      threadDetail: null,
    };
    const store = mockStore(state);

    await store.dispatch(asyncToggleUpVoteThread('thread-1'));
    const actions = store.getActions();

    expect(actions).toEqual([
      {
        type: ActionType.TOGGLE_UP_VOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      },
    ]);
    expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
  });

  it('should dispatch neutral vote instead of up vote when already upvoted', async () => {
    api.neutralizeThreadVote.mockResolvedValue({ data: {} });
    const state = {
      authUser: { id: 'user-1' },
      threads: [{
        id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [],
      }],
      threadDetail: null,
    };
    const store = mockStore(state);

    await store.dispatch(asyncToggleUpVoteThread('thread-1'));
    const actions = store.getActions();

    expect(actions).toEqual([
      {
        type: ActionType.TOGGLE_NEUTRAL_VOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      },
    ]);
    expect(api.neutralizeThreadVote).toHaveBeenCalledWith('thread-1');
  });

  it('should roll back the optimistic vote when the API call fails', async () => {
    api.upVoteThread.mockRejectedValue(new Error('Vote failed'));
    const state = {
      authUser: { id: 'user-1' },
      threads: [{
        id: 'thread-1', upVotesBy: [], downVotesBy: [],
      }],
      threadDetail: null,
    };
    const store = mockStore(state);

    await expect(store.dispatch(asyncToggleUpVoteThread('thread-1')))
      .rejects.toThrow('Vote failed');
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: ActionType.TOGGLE_UP_VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    });
    expect(actions[1]).toEqual({
      type: ActionType.TOGGLE_NEUTRAL_VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    });
  });

  it('should throw an error and not call the API when the user is not authenticated', async () => {
    const store = mockStore({
      authUser: null, threads: [], threadDetail: null,
    });

    await expect(store.dispatch(asyncToggleUpVoteThread('thread-1')))
      .rejects.toThrow('You must be logged in to vote');
    expect(api.upVoteThread).not.toHaveBeenCalled();
  });
});

describe('asyncToggleDownVoteThread thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch TOGGLE_DOWN_VOTE_THREAD and call the API when not voted', async () => {
    api.downVoteThread.mockResolvedValue({ data: {} });
    const state = {
      authUser: { id: 'user-1' },
      threads: [{
        id: 'thread-1', upVotesBy: [], downVotesBy: [],
      }],
      threadDetail: null,
    };
    const store = mockStore(state);

    await store.dispatch(asyncToggleDownVoteThread('thread-1'));
    const actions = store.getActions();

    expect(actions).toEqual([
      {
        type: ActionType.TOGGLE_DOWN_VOTE_THREAD,
        payload: { threadId: 'thread-1', userId: 'user-1' },
      },
    ]);
    expect(api.downVoteThread).toHaveBeenCalledWith('thread-1');
  });
});

import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import api from '../../utils/api';
import {
  ActionType,
  asyncAddComment,
  asyncToggleUpVoteComment,
  asyncToggleDownVoteComment,
} from './action';

jest.mock('../../utils/api');

const mockStore = configureMockStore([thunk]);

describe('asyncAddComment thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch ADD_COMMENT when the request succeeds', async () => {
    const comment = { id: 'comment-1', content: 'Nice thread!' };
    api.createComment.mockResolvedValue({ data: { comment } });

    const store = mockStore({});
    await store.dispatch(asyncAddComment('thread-1', { content: 'Nice thread!' }));

    expect(api.createComment).toHaveBeenCalledWith('thread-1', { content: 'Nice thread!' });
    expect(store.getActions()).toEqual([
      { type: ActionType.ADD_COMMENT, payload: { comment } },
    ]);
  });

  it('should throw and dispatch nothing when the request fails', async () => {
    api.createComment.mockRejectedValue(new Error('Failed to add comment'));
    const store = mockStore({});

    await expect(store.dispatch(asyncAddComment('thread-1', { content: 'x' })))
      .rejects.toThrow('Failed to add comment');
    expect(store.getActions()).toHaveLength(0);
  });
});

describe('asyncToggleUpVoteComment thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch TOGGLE_UP_VOTE_COMMENT and call the API when not yet voted', async () => {
    api.upVoteComment.mockResolvedValue({ data: {} });
    const state = {
      authUser: { id: 'user-1' },
      threadDetail: {
        id: 'thread-1',
        comments: [{
          id: 'comment-1', upVotesBy: [], downVotesBy: [],
        }],
      },
    };
    const store = mockStore(state);

    await store.dispatch(asyncToggleUpVoteComment('thread-1', 'comment-1'));

    expect(store.getActions()).toEqual([
      {
        type: ActionType.TOGGLE_UP_VOTE_COMMENT,
        payload: { threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' },
      },
    ]);
    expect(api.upVoteComment).toHaveBeenCalledWith('thread-1', 'comment-1');
  });

  it('should throw when the user is not authenticated', async () => {
    const store = mockStore({ authUser: null, threadDetail: null });

    await expect(store.dispatch(asyncToggleUpVoteComment('thread-1', 'comment-1')))
      .rejects.toThrow('You must be logged in to vote');
    expect(api.upVoteComment).not.toHaveBeenCalled();
  });
});

describe('asyncToggleDownVoteComment thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch neutral vote when the comment is already downvoted', async () => {
    api.neutralizeCommentVote.mockResolvedValue({ data: {} });
    const state = {
      authUser: { id: 'user-1' },
      threadDetail: {
        id: 'thread-1',
        comments: [{
          id: 'comment-1', upVotesBy: [], downVotesBy: ['user-1'],
        }],
      },
    };
    const store = mockStore(state);

    await store.dispatch(asyncToggleDownVoteComment('thread-1', 'comment-1'));

    expect(store.getActions()).toEqual([
      {
        type: ActionType.TOGGLE_NEUTRAL_VOTE_COMMENT,
        payload: { threadId: 'thread-1', commentId: 'comment-1', userId: 'user-1' },
      },
    ]);
    expect(api.neutralizeCommentVote).toHaveBeenCalledWith('thread-1', 'comment-1');
  });
});

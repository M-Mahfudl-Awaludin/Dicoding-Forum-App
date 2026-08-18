import {
  threadsReducer,
  threadDetailReducer,
  loadingReducer,
  errorReducer,
} from './reducer';
import { ActionType } from './action';
import { ActionType as CommentActionType } from '../comments/action';

const sampleThreads = [
  {
    id: 'thread-1',
    title: 'Thread 1',
    body: 'Body 1',
    upVotesBy: [],
    downVotesBy: [],
  },
  {
    id: 'thread-2',
    title: 'Thread 2',
    body: 'Body 2',
    upVotesBy: ['user-2'],
    downVotesBy: [],
  },
];

describe('threadsReducer', () => {
  it('should return the initial state ([]) when given by unknown action', () => {
    const nextState = threadsReducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toEqual([]);
  });

  it('should return the threads when given RECEIVE_THREADS action', () => {
    const action = {
      type: ActionType.RECEIVE_THREADS,
      payload: { threads: sampleThreads },
    };

    const nextState = threadsReducer([], action);

    expect(nextState).toEqual(sampleThreads);
  });

  it('should prepend the new thread when given ADD_THREAD action', () => {
    const newThread = {
      id: 'thread-3', title: 'New Thread', upVotesBy: [], downVotesBy: [],
    };
    const action = {
      type: ActionType.ADD_THREAD,
      payload: { thread: newThread },
    };

    const nextState = threadsReducer(sampleThreads, action);

    expect(nextState).toHaveLength(3);
    expect(nextState[0]).toEqual(newThread);
  });

  it('should add userId to upVotesBy on TOGGLE_UP_VOTE_THREAD for a thread with no votes', () => {
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    };

    const nextState = threadsReducer(sampleThreads, action);
    const thread = nextState.find((t) => t.id === 'thread-1');

    expect(thread.upVotesBy).toEqual(['user-1']);
    expect(thread.downVotesBy).toEqual([]);
  });

  it('should remove userId from upVotesBy when upvote toggled twice (toggle off)', () => {
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_THREAD,
      payload: { threadId: 'thread-2', userId: 'user-2' },
    };

    const nextState = threadsReducer(sampleThreads, action);
    const thread = nextState.find((t) => t.id === 'thread-2');

    expect(thread.upVotesBy).toEqual([]);
  });

  it('should move userId from downVotesBy to upVotesBy when upvoting a downvoted thread', () => {
    const threadsWithDownVote = [
      {
        id: 'thread-1', upVotesBy: [], downVotesBy: ['user-1'],
      },
    ];
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    };

    const nextState = threadsReducer(threadsWithDownVote, action);

    expect(nextState[0].upVotesBy).toEqual(['user-1']);
    expect(nextState[0].downVotesBy).toEqual([]);
  });

  it('should move userId from upVotesBy to downVotesBy when downvoting an upvoted thread', () => {
    const action = {
      type: ActionType.TOGGLE_DOWN_VOTE_THREAD,
      payload: { threadId: 'thread-2', userId: 'user-2' },
    };

    const nextState = threadsReducer(sampleThreads, action);
    const thread = nextState.find((t) => t.id === 'thread-2');

    expect(thread.upVotesBy).toEqual([]);
    expect(thread.downVotesBy).toEqual(['user-2']);
  });

  it('should remove userId from both vote lists on TOGGLE_NEUTRAL_VOTE_THREAD', () => {
    const action = {
      type: ActionType.TOGGLE_NEUTRAL_VOTE_THREAD,
      payload: { threadId: 'thread-2', userId: 'user-2' },
    };

    const nextState = threadsReducer(sampleThreads, action);
    const thread = nextState.find((t) => t.id === 'thread-2');

    expect(thread.upVotesBy).toEqual([]);
    expect(thread.downVotesBy).toEqual([]);
  });

  it('should not modify threads that do not match the threadId on vote actions', () => {
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    };

    const nextState = threadsReducer(sampleThreads, action);
    const untouchedThread = nextState.find((t) => t.id === 'thread-2');

    expect(untouchedThread).toEqual(sampleThreads[1]);
  });
});

describe('threadDetailReducer', () => {
  const sampleDetail = {
    id: 'thread-1',
    title: 'Thread 1',
    upVotesBy: [],
    downVotesBy: [],
    comments: [
      {
        id: 'comment-1', content: 'Nice', upVotesBy: [], downVotesBy: [],
      },
    ],
  };

  it('should return the initial state (null) when given by unknown action', () => {
    const nextState = threadDetailReducer(undefined, { type: 'UNKNOWN' });

    expect(nextState).toEqual(null);
  });

  it('should return the detail thread when given RECEIVE_THREAD_DETAIL action', () => {
    const action = {
      type: ActionType.RECEIVE_THREAD_DETAIL,
      payload: { detailThread: sampleDetail },
    };

    const nextState = threadDetailReducer(null, action);

    expect(nextState).toEqual(sampleDetail);
  });

  it('should toggle up vote on the thread detail when threadId matches', () => {
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-1' },
    };

    const nextState = threadDetailReducer(sampleDetail, action);

    expect(nextState.upVotesBy).toEqual(['user-1']);
  });

  it('should not change the thread detail when the vote action threadId does not match', () => {
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_THREAD,
      payload: { threadId: 'thread-other', userId: 'user-1' },
    };

    const nextState = threadDetailReducer(sampleDetail, action);

    expect(nextState).toEqual(sampleDetail);
  });

  it('should append a new comment when given ADD_COMMENT action', () => {
    const newComment = {
      id: 'comment-2', content: 'Another comment', upVotesBy: [], downVotesBy: [],
    };
    const action = {
      type: CommentActionType.ADD_COMMENT,
      payload: { comment: newComment },
    };

    const nextState = threadDetailReducer(sampleDetail, action);

    expect(nextState.comments).toHaveLength(2);
    expect(nextState.comments[1]).toEqual(newComment);
  });

  it('should toggle up vote on a nested comment when TOGGLE_UP_VOTE_COMMENT dispatched', () => {
    const action = {
      type: CommentActionType.TOGGLE_UP_VOTE_COMMENT,
      payload: { threadId: 'thread-1', commentId: 'comment-1', userId: 'user-9' },
    };

    const nextState = threadDetailReducer(sampleDetail, action);

    expect(nextState.comments[0].upVotesBy).toEqual(['user-9']);
  });
});

describe('loadingReducer (threads)', () => {
  it('should return false as the initial state', () => {
    expect(loadingReducer(undefined, { type: 'UNKNOWN' })).toEqual(false);
  });

  it('should return the loading value when given SET_LOADING action', () => {
    const nextState = loadingReducer(false, {
      type: ActionType.SET_LOADING,
      payload: { loading: true },
    });

    expect(nextState).toEqual(true);
  });
});

describe('errorReducer (threads)', () => {
  it('should return null as the initial state', () => {
    expect(errorReducer(undefined, { type: 'UNKNOWN' })).toEqual(null);
  });

  it('should return the error message when given SET_ERROR action', () => {
    const nextState = errorReducer(null, {
      type: ActionType.SET_ERROR,
      payload: { error: 'Something went wrong' },
    });

    expect(nextState).toEqual('Something went wrong');
  });
});

import commentsReducer from './reducer';
import { ActionType } from './action';

const sampleComments = [
  {
    id: 'comment-1', content: 'First', upVotesBy: [], downVotesBy: [],
  },
  {
    id: 'comment-2', content: 'Second', upVotesBy: ['user-1'], downVotesBy: [],
  },
];

describe('commentsReducer', () => {
  it('should return the initial state ([]) when given by unknown action', () => {
    expect(commentsReducer(undefined, { type: 'UNKNOWN' })).toEqual([]);
  });

  it('should append the new comment when given ADD_COMMENT action', () => {
    const newComment = {
      id: 'comment-3', content: 'Third', upVotesBy: [], downVotesBy: [],
    };
    const action = {
      type: ActionType.ADD_COMMENT,
      payload: { comment: newComment },
    };

    const nextState = commentsReducer(sampleComments, action);

    expect(nextState).toHaveLength(3);
    expect(nextState[2]).toEqual(newComment);
  });

  it('should toggle up vote for the matching comment', () => {
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_COMMENT,
      payload: { commentId: 'comment-1', userId: 'user-5' },
    };

    const nextState = commentsReducer(sampleComments, action);
    const comment = nextState.find((c) => c.id === 'comment-1');

    expect(comment.upVotesBy).toEqual(['user-5']);
  });

  it('should remove the vote when toggling up vote on an already upvoted comment', () => {
    const action = {
      type: ActionType.TOGGLE_UP_VOTE_COMMENT,
      payload: { commentId: 'comment-2', userId: 'user-1' },
    };

    const nextState = commentsReducer(sampleComments, action);
    const comment = nextState.find((c) => c.id === 'comment-2');

    expect(comment.upVotesBy).toEqual([]);
  });

  it('should neutralize votes for the matching comment', () => {
    const action = {
      type: ActionType.TOGGLE_NEUTRAL_VOTE_COMMENT,
      payload: { commentId: 'comment-2', userId: 'user-1' },
    };

    const nextState = commentsReducer(sampleComments, action);
    const comment = nextState.find((c) => c.id === 'comment-2');

    expect(comment.upVotesBy).toEqual([]);
    expect(comment.downVotesBy).toEqual([]);
  });
});

import authUserReducer from './reducer';
import { ActionType } from './action';

describe('authUserReducer', () => {
  it('should return the initial state (null) when given by unknown action', () => {
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    const nextState = authUserReducer(initialState, action);

    expect(nextState).toEqual(null);
  });

  it('should return the authUser when given SET_AUTH_USER action', () => {
    const initialState = null;
    const authUser = {
      id: 'user-1', name: 'John Doe', email: 'john@example.com', avatar: 'avatar.png',
    };
    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser },
    };

    const nextState = authUserReducer(initialState, action);

    expect(nextState).toEqual(authUser);
  });

  it('should replace the previous authUser when given SET_AUTH_USER action twice', () => {
    const firstUser = { id: 'user-1', name: 'John Doe' };
    const secondUser = { id: 'user-2', name: 'Jane Doe' };

    let state = authUserReducer(null, {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser: firstUser },
    });
    state = authUserReducer(state, {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser: secondUser },
    });

    expect(state).toEqual(secondUser);
  });

  it('should return null when given UNSET_AUTH_USER action', () => {
    const initialState = { id: 'user-1', name: 'John Doe' };
    const action = { type: ActionType.UNSET_AUTH_USER };

    const nextState = authUserReducer(initialState, action);

    expect(nextState).toEqual(null);
  });
});

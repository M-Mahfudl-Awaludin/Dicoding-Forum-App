import usersReducer from './reducer';
import { ActionType } from './action';

describe('usersReducer', () => {
  it('should return the initial state ([]) when given by unknown action', () => {
    expect(usersReducer(undefined, { type: 'UNKNOWN' })).toEqual([]);
  });

  it('should return the users when given RECEIVE_USERS action', () => {
    const users = [
      { id: 'user-1', name: 'John', avatar: 'john.png' },
      { id: 'user-2', name: 'Jane', avatar: 'jane.png' },
    ];
    const action = {
      type: ActionType.RECEIVE_USERS,
      payload: { users },
    };

    expect(usersReducer([], action)).toEqual(users);
  });
});

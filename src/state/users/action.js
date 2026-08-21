import api from '../../utils/api';

const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
};

function receiveUsersAction(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function asyncReceiveUsers() {
  return async (dispatch) => {
    try {
      const response = await api.getAllUsers();
      dispatch(receiveUsersAction(response.data.users));
    } catch (error) {
      // The user list only enriches thread/comment authors with name &
      // avatar. If it fails, ThreadItem already falls back to "Unknown",
      // so the page remains usable — just log it instead of throwing.
      console.warn('Failed to load users list:', error.message);
    }
  };
}

export {
  ActionType,
  receiveUsersAction,
  asyncReceiveUsers,
};

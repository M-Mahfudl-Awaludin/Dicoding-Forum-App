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
    } catch {
      // The user list only enriches thread/comment authors with name &
      // avatar. If it fails, ThreadItem already falls back to "Unknown",
      // so the page remains usable — no need to surface this to the user.
    }
  };
}

export {
  ActionType,
  receiveUsersAction,
  asyncReceiveUsers,
};

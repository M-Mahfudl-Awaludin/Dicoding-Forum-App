import api from '../../utils/api';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

function setAuthUserAction(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

function unsetAuthUserAction() {
  return {
    type: ActionType.UNSET_AUTH_USER,
  };
}

function asyncSetAuthUser({ email, password }) {
  return async (dispatch) => {
    try {
      const response = await api.login({ email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);

      const profileResponse = await api.getOwnProfile();
      if (profileResponse.data?.user) {
        dispatch(setAuthUserAction(profileResponse.data.user));
      } else {
        throw new Error('Failed to get user profile');
      }
    } catch (error) {
      throw error;
    }
  };
}

function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    try {
      await api.register({ name, email, password });
      const response = await api.login({ email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);

      const profileResponse = await api.getOwnProfile();
      if (profileResponse.data?.user) {
        dispatch(setAuthUserAction(profileResponse.data.user));
      } else {
        throw new Error('Failed to get user profile');
      }
    } catch (error) {
      throw error;
    }
  };
}

function asyncUnsetAuthUser() {
  return (dispatch) => {
    localStorage.removeItem('token');
    dispatch(unsetAuthUserAction());
  };
}

function asyncGetOwnProfile() {
  return async (dispatch) => {
    try {
      const response = await api.getOwnProfile();
      if (response.data?.user) {
        dispatch(setAuthUserAction(response.data.user));
      } else {
        localStorage.removeItem('token');
        dispatch(unsetAuthUserAction());
      }
    } catch (error) {
      localStorage.removeItem('token');
      dispatch(unsetAuthUserAction());
    }
  };
}

export {
  ActionType,
  setAuthUserAction,
  unsetAuthUserAction,
  asyncSetAuthUser,
  asyncRegisterUser,
  asyncUnsetAuthUser,
  asyncGetOwnProfile,
};

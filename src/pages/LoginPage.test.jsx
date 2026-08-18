import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import LoginPage from './LoginPage';
import api from '../utils/api';

jest.mock('../utils/api');

const mockStore = configureMockStore([thunk]);

function renderLoginPage(state = { authUser: null }) {
  const store = mockStore(state);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      </Provider>,
    ),
  };
}

describe('LoginPage component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the email and password inputs and the login button', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should let the user type into the email and password fields', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'secret12');

    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('secret12');
  });

  it('should dispatch the login thunk and call the API when the form is submitted', async () => {
    const user = userEvent.setup();
    api.login.mockResolvedValue({ data: { token: 'token-123' } });
    api.getOwnProfile.mockResolvedValue({ data: { user: { id: 'user-1', name: 'John' } } });

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret12');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({ email: 'john@example.com', password: 'secret12' });
    });
  });

  it('should display an error message when login fails', async () => {
    const user = userEvent.setup();
    api.login.mockRejectedValue(new Error('Email atau password salah'));

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Email atau password salah')).toBeInTheDocument();
  });
});

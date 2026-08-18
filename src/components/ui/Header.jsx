import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { asyncUnsetAuthUser } from '../../state/auth/action';
import Avatar from './Avatar';
import './Header.css';

function Header() {
  const { authUser } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>Dicoding Forum</h1>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Threads</Link>
          <Link to="/leaderboards" className="nav-link">Leaderboard</Link>
          {authUser ? (
            <div className="header-user">
              <Link to="/threads/new" className="nav-link nav-link-button">
                Buat Thread
              </Link>
              <div className="user-menu">
                <Avatar src={authUser.avatar} alt={authUser.name} size="small" />
                <span className="user-name">{authUser.name}</span>
                <button type="button" onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="header-auth">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-link-button">Daftar</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './state/store';
import { asyncGetOwnProfile } from './state/auth/action';
import Header from './components/ui/Header';
import ThreadListPage from './pages/ThreadListPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(asyncGetOwnProfile());
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ThreadListPage />} />
          <Route path="/threads/:id" element={<ThreadDetailPage />} />
          <Route path="/threads/new" element={<CreateThreadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <React.StrictMode>
          <AppContent />
        </React.StrictMode>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

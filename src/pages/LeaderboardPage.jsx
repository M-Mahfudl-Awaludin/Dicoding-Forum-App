import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncReceiveLeaderboards } from '../state/leaderboards/action';
import Avatar from '../components/ui/Avatar';
import Loading from '../components/ui/Loading';
import './LeaderboardPage.css';

function LeaderboardPage() {
  const {
    leaderboards,
    leaderboardsLoading: loading,
    leaderboardsError: error,
  } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>Leaderboard</h1>
          <p>Pengguna dengan skor tertinggi</p>
        </div>

        {leaderboards.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada data leaderboard.</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {leaderboards.map((item, index) => (
              <div
                key={item.user.id}
                className={`leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`}
              >
                <div className="leaderboard-rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="leaderboard-user">
                  <Avatar
                    src={item.user.avatar}
                    alt={item.user.name}
                    size="large"
                  />
                  <div className="leaderboard-user-info">
                    <h3 className="leaderboard-user-name">{item.user.name}</h3>
                    <p className="leaderboard-user-email">{item.user.email}</p>
                  </div>
                </div>
                <div className="leaderboard-score">
                  <span className="score-label">Skor</span>
                  <span className="score-value">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;

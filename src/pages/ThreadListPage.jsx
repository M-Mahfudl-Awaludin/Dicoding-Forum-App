import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncReceiveThreads,
  asyncToggleUpVoteThread,
  asyncToggleDownVoteThread,
} from '../state/threads/action';
import ThreadItem from '../components/threads/ThreadItem';
import Loading from '../components/ui/Loading';
import './ThreadListPage.css';

function ThreadListPage() {
  const { threads, loading, error, authUser } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(asyncReceiveThreads());
  }, [dispatch]);

  const categories = ['all', ...new Set(threads.map((thread) => thread.category).filter(Boolean))];

  const filteredThreads = selectedCategory === 'all'
    ? threads
    : threads.filter((thread) => thread.category === selectedCategory);

  const handleUpVote = (threadId) => {
    dispatch(asyncToggleUpVoteThread(threadId));
  };

  const handleDownVote = (threadId) => {
    dispatch(asyncToggleDownVoteThread(threadId));
  };

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
    <div className="thread-list-page">
      <div className="thread-list-container">
        <div className="thread-list-header">
          <h2>Daftar Thread</h2>
          <div className="category-filter">
            <label htmlFor="category-select">Filter Kategori:</label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Semua Kategori' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filteredThreads.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada thread yang ditemukan.</p>
          </div>
        ) : (
          <div className="thread-list">
            {filteredThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                authUser={authUser}
                onUpVote={handleUpVote}
                onDownVote={handleDownVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadListPage;

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';

const sampleThread = {
  id: 'thread-1',
  title: 'Belajar React',
  body: 'Ini adalah isi thread tentang belajar React yang cukup panjang untuk diuji potongannya.',
  category: 'Technology',
  createdAt: new Date().toISOString(),
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 3,
  owner: { id: 'user-1', name: 'John Doe', avatar: '' },
};

function renderThreadItem(props) {
  return render(
    <MemoryRouter>
      <ThreadItem {...props} />
    </MemoryRouter>,
  );
}

describe('ThreadItem component', () => {
  it('should render the thread title, category, and author name', () => {
    renderThreadItem({
      thread: sampleThread, authUser: null, onUpVote: () => {}, onDownVote: () => {},
    });

    expect(screen.getByText('Belajar React')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should disable the vote buttons when there is no authenticated user', () => {
    renderThreadItem({
      thread: sampleThread, authUser: null, onUpVote: () => {}, onDownVote: () => {},
    });

    expect(screen.getByRole('button', { name: /upvote/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /downvote/i })).toBeDisabled();
  });

  it('should call onUpVote with the thread id when clicked by a logged-in user', async () => {
    const user = userEvent.setup();
    const handleUpVote = jest.fn();
    renderThreadItem({
      thread: sampleThread,
      authUser: { id: 'user-2', name: 'Jane' },
      onUpVote: handleUpVote,
      onDownVote: () => {},
    });

    await user.click(screen.getByRole('button', { name: /upvote/i }));

    expect(handleUpVote).toHaveBeenCalledWith('thread-1');
  });

  it('should truncate a long thread body with an ellipsis', () => {
    const longThread = { ...sampleThread, body: 'a'.repeat(200) };
    renderThreadItem({
      thread: longThread, authUser: null, onUpVote: () => {}, onDownVote: () => {},
    });

    const preview = screen.getByText(/a+\.\.\.$/);
    expect(preview.textContent.length).toBeLessThan(longThread.body.length);
  });
});

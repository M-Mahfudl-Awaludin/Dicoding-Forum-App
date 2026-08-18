import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButton from './VoteButton';

describe('VoteButton component', () => {
  it('should render the up vote count and icon', () => {
    render(
      <VoteButton type="up" count={5} isActive={false} onClick={() => {}} disabled={false} />,
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upvote/i })).toBeInTheDocument();
  });

  it('should render the down vote count and icon', () => {
    render(
      <VoteButton type="down" count={2} isActive={false} onClick={() => {}} disabled={false} />,
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /downvote/i })).toBeInTheDocument();
  });

  it('should apply the active class when isActive is true', () => {
    render(<VoteButton type="up" count={1} isActive onClick={() => {}} disabled={false} />);

    expect(screen.getByRole('button', { name: /upvote/i })).toHaveClass('vote-button-active');
  });

  it('should call onClick when the button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <VoteButton type="up" count={0} isActive={false} onClick={handleClick} disabled={false} />,
    );

    await user.click(screen.getByRole('button', { name: /upvote/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled and not call onClick when disabled is true', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<VoteButton type="up" count={0} isActive={false} onClick={handleClick} disabled />);

    const button = screen.getByRole('button', { name: /upvote/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

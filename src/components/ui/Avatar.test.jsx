import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar component', () => {
  it('should render an image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.png" alt="John Doe" />);

    const image = screen.getByRole('img', { name: 'John Doe' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('should render the first letter of alt as a placeholder when src is not provided', () => {
    render(<Avatar src={null} alt="John Doe" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should render a "?" placeholder when neither src nor alt is provided', () => {
    render(<Avatar src={null} alt="" />);

    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should apply the size class based on the size prop', () => {
    const { container } = render(<Avatar src={null} alt="Jane" size="large" />);

    expect(container.querySelector('.avatar-large')).toBeInTheDocument();
  });
});

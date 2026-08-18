import Avatar from './Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;

export const WithImage = {
  args: {
    src: 'https://ui-avatars.com/api/?name=John+Doe',
    alt: 'John Doe',
    size: 'medium',
  },
};

export const PlaceholderInitial = {
  args: {
    src: null,
    alt: 'Jane Doe',
    size: 'medium',
  },
};

export const SmallSize = {
  args: {
    src: null,
    alt: 'Small Avatar',
    size: 'small',
  },
};

export const LargeSize = {
  args: {
    src: null,
    alt: 'Large Avatar',
    size: 'large',
  },
};

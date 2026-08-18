import VoteButton from './VoteButton';

const meta = {
  title: 'UI/VoteButton',
  component: VoteButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['up', 'down'],
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;

export const UpVoteInactive = {
  args: {
    type: 'up',
    count: 12,
    isActive: false,
    disabled: false,
  },
};

export const UpVoteActive = {
  args: {
    type: 'up',
    count: 13,
    isActive: true,
    disabled: false,
  },
};

export const DownVoteInactive = {
  args: {
    type: 'down',
    count: 3,
    isActive: false,
    disabled: false,
  },
};

export const DownVoteActive = {
  args: {
    type: 'down',
    count: 4,
    isActive: true,
    disabled: false,
  },
};

export const Disabled = {
  args: {
    type: 'up',
    count: 5,
    isActive: false,
    disabled: true,
  },
};

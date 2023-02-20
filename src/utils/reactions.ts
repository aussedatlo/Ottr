import { Reaction } from '../types/reaction';

export const getReactionIcon = (reaction: Reaction): string => {
  switch (reaction) {
    case '+':
      return 'thumb-up';
    case '-':
      return 'thumb-down';
    default:
      return undefined;
  }
};

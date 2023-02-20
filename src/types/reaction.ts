const reactions = ['+', '-'] as const;
export type Reaction = (typeof reactions)[number];
export const isReaction = (x: any): x is Reaction => reactions.includes(x);

export type ItemAmount = {
  item: string;
  amount: number;
};

/**
 * The player's game state.
 */
export type CyoaGameState = {
  inventory: Record<string, ItemAmount>;
};

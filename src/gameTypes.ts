/**
 * Contains the various types related to the state of the game and the game itself.
 */

export type ItemAmount = {
  item: string;
  amount: number;
};

/* Condition Types */

export type GameStateCondition = {
  type: string;
};

export type GameStateConditionItemCountRange = GameStateCondition & {
  type: "ItemCount";
  item: string;
  min?: number;
  max?: number;
};

/* Action Types */

export type CyoaChoiceAction = {
  [index: string]: unknown;
  type: string;
};

export type CyoaChoiceActionModifyItem = CyoaChoiceAction & ItemAmount;

/**
 * The player's game state.
 */
export type CyoaGameState = {
  inventory: Record<string, ItemAmount>;
};

/* Game Structure Types */

export type CyoaChoice = {
  content: string;
  next: string;
  hidden?: boolean;
  requirements: GameStateCondition[];
  actions: CyoaChoiceAction[];
};

/**
 * Information on how a choice should be shown to the player
 */
export type CyoaChoiceDisplayState = {
  choice: CyoaChoice;
  unavailable: boolean;
};

export type CyoaStoryNode = {
  content: string;
  choices: CyoaChoice[];
};

export type CyoaGame = {
  metadata: {
    title: string;
    author: string;
    version: string;
  };
  nodes: Record<string, CyoaStoryNode>;
};

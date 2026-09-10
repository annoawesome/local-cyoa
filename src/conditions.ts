import { CyoaGameState } from "./gameState.js";

export type GameStateCondition = {
  type: string;
};

export type GameStateConditionItemCountRange = GameStateCondition & {
  type: "ItemCount";
  item: string;
  min?: number;
  max?: number;
};

// Pray that the author didn't mess it up and not include the other required properties
export function isItemCountRangeCondition(
  condition: GameStateCondition,
): condition is GameStateConditionItemCountRange {
  return condition.type === "ItemCount";
}

function gameStateSatisfiesCondition(
  gameState: CyoaGameState,
  condition: GameStateCondition,
) {
  if (isItemCountRangeCondition(condition)) {
    const itemName = condition.item;
    const itemState = gameState.inventory[itemName] || {
      item: itemName,
      amount: 0,
    };

    if (itemState) {
      return (
        (typeof condition.min === "number" &&
          condition.min <= itemState.amount) ||
        (typeof condition.max === "number" && condition.max >= itemState.amount)
      );
    }
  }

  return false;
}

export function gameStateSatisfiesConditions(
  gameState: CyoaGameState,
  conditions: GameStateCondition[],
) {
  if (!conditions) {
    return true;
  }

  for (const condition of conditions) {
    if (!gameStateSatisfiesCondition(gameState, condition)) {
      return false;
    }
  }

  return true;
}

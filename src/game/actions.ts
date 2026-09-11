import type {
  CyoaChoice,
  CyoaChoiceActionModifyItem,
  CyoaGameState,
} from "./gameTypes.js";

import { getEmptyGameState } from "./gameState.js";

export function choiceActionAddItem(
  choice: CyoaChoiceActionModifyItem,
  gameState: CyoaGameState,
) {
  const updatedGameState = { ...gameState };

  if (!updatedGameState.inventory[choice.item]) {
    updatedGameState.inventory[choice.item] = {
      item: choice.item,
      amount: !choice.amount && choice.amount === 0 ? 0 : 1, // if no amount is specified, add one of the item
    };
  } else {
    updatedGameState.inventory[choice.item].amount += choice.amount;
  }

  return updatedGameState;
}

export function applyChoiceActions(
  choice: CyoaChoice,
  gameState: CyoaGameState,
) {
  if (choice.actions) {
    let updatedGameState = gameState;

    for (const action of choice.actions) {
      if (action.type === "AddItem") {
        updatedGameState = choiceActionAddItem(
          action as CyoaChoiceActionModifyItem,
          updatedGameState,
        );
      } else if (action.type === "ResetGame") {
        updatedGameState = getEmptyGameState();

        // Prevent next actions if they exist from applying
        // Ideally this is the only action listed if it exists
        break;
      }
    }

    return updatedGameState;
  }
}

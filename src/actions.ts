import type {
  CyoaChoice,
  CyoaChoiceActionModifyItem,
  CyoaGameState,
} from "./gameTypes.js";

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
      }
    }

    return updatedGameState;
  }
}

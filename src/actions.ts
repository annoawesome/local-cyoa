import { CyoaChoiceActionModifyItem, CyoaGameState } from "./gameTypes.js";

export function choiceActionAddItem(
  choice: CyoaChoiceActionModifyItem,
  gameState: CyoaGameState,
  setGameState: React.Dispatch<React.SetStateAction<CyoaGameState>>,
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

  setGameState(updatedGameState);
}

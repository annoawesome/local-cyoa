import { CyoaGameState, ItemAmount } from "./gameState.js";

export type CyoaChoiceAction = {
  [index: string]: unknown;
  type: string;
};

export type CyoaChoiceActionModifyItem = CyoaChoiceAction & ItemAmount;

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

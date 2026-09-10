import type { CyoaGameState } from "./gameTypes.js";

export function getEmptyGameState(): CyoaGameState {
  return {
    inventory: {},
  };
}

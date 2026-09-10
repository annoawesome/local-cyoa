import type { CyoaChoice, CyoaGameState } from "../game/gameTypes.js";

import React from "react";
import { gameStateSatisfiesConditions } from "../game/conditions.js";
import { applyChoiceActions } from "../game/actions.js";

/**
 * Information on how a choice should be shown to the player
 */
type CyoaChoiceDisplayState = {
  choice: CyoaChoice;
  unavailable: boolean;
};

function onSelectChoice(
  choice: CyoaChoice,
  setCurrentNode: React.Dispatch<React.SetStateAction<string>>,
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>,
  gameState: CyoaGameState,
  setGameState: React.Dispatch<React.SetStateAction<CyoaGameState>>,
) {
  const updatedGameState = applyChoiceActions(choice, gameState);

  if (updatedGameState) {
    setGameState(updatedGameState);
  }

  setCurrentNode(choice.next);
  setCurrentSection(choice.content);
}

export default function ChoiceList({
  choices,
  setCurrentNode,
  setCurrentSection,
  gameState,
  setGameState,
}: {
  choices: CyoaChoice[];
  setCurrentNode: React.Dispatch<React.SetStateAction<string>>;
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
  gameState: CyoaGameState;
  setGameState: React.Dispatch<React.SetStateAction<CyoaGameState>>;
}) {
  choices = choices.filter(
    (choice) =>
      gameStateSatisfiesConditions(gameState, choice.requirements) ||
      !choice.hidden,
  );

  const choiceDisplayStates = choices.map((choice) => {
    const choiceDisplayState: CyoaChoiceDisplayState = {
      choice: choice,
      unavailable: false,
    };

    if (!gameStateSatisfiesConditions(gameState, choice.requirements)) {
      choiceDisplayState.unavailable = true;
    }

    return choiceDisplayState;
  });

  const choiceList = choiceDisplayStates.map((choiceDisplayState, i) => {
    const choice = choiceDisplayState.choice;

    return (
      <button
        className="btn-choice"
        key={i}
        disabled={choiceDisplayState.unavailable}
        onClick={() => {
          onSelectChoice(
            choice,
            setCurrentNode,
            setCurrentSection,
            gameState,
            setGameState,
          );
        }}
      >
        {choice.content}
      </button>
    );
  });

  return (
    <div className="width-slim margin-auto flex-column gap-16px">
      {choiceList}
    </div>
  );
}

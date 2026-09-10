import React, { useState } from "react";
import { applyChoiceActions } from "./actions.js";
import { gameStateSatisfiesConditions } from "./conditions.js";

import type {
  CyoaChoice,
  CyoaChoiceDisplayState,
  CyoaGame,
  CyoaGameState,
} from "./gameTypes.js";

function Topbar({
  setGame,
  resetGameState,
}: {
  setGame: React.Dispatch<React.SetStateAction<CyoaGame | null>>;
  resetGameState: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const onChangeFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
    // This should never happen!
    if (!ev.target.files) {
      return;
    }

    const selectedFile = ev.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onClickLoadAdventure = () => {
    if (!file) {
      return;
    }

    // TODO: Handle situation where file cannot be parsed as JSON
    file.text().then((text) => {
      const json = JSON.parse(text);
      setGame(json);
      resetGameState();
    });
  };

  return (
    <nav id="topbar">
      <input type="file" name="" id="" accept=".json" onChange={onChangeFile} />
      <button type="button" onClick={onClickLoadAdventure}>
        Load Adventure
      </button>
    </nav>
  );
}

function GameInfo({ title, author }: { title: string; author: string }) {
  return (
    <div className="width-slim margin-auto">
      <h1 id="game-title">{title}</h1>
      <p id="game-author" className="text-secondary">
        by {author}
      </p>
    </div>
  );
}

function BodyText({ text, section }: { text: string; section: string }) {
  const content = text
    .split("\n")
    .map((paragraph, i) => <p key={i}>{paragraph}</p>);

  return (
    <div id="body-text" className="width-slim margin-auto">
      {section ? <h2>{section}</h2> : ""}
      {content}
    </div>
  );
}

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

function ChoiceList({
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

export default function App() {
  const [game, setGame] = useState<CyoaGame | null>(null);
  const [currentNode, setCurrentNode] = useState("start");
  const [currentSection, setCurrentSection] = useState("");
  const [gameState, setGameState] = useState<CyoaGameState>({
    inventory: {},
  });

  const resetGameState = () => {
    setCurrentNode("start");
    setCurrentSection("");
    setGameState({
      inventory: {},
    });
  };

  const node = game && game.nodes[currentNode];

  return (
    <>
      <Topbar setGame={setGame} resetGameState={resetGameState} />
      {game ? (
        <>
          <GameInfo title={game.metadata.title} author={game.metadata.author} />
          {node ? (
            <>
              <BodyText
                text={game.nodes[currentNode].content}
                section={currentSection}
              />
              <ChoiceList
                choices={game.nodes[currentNode].choices}
                setCurrentNode={setCurrentNode}
                setCurrentSection={setCurrentSection}
                gameState={gameState}
                setGameState={setGameState}
              />
            </>
          ) : (
            <>
              <h2 className="width-slim margin-auto">Oops!</h2>
              <p className="width-slim margin-auto">
                Sorry, but there is no content here. Either this is intentional
                and you have reached the end of the story, or the author forgot
                to fill in this section. Please reload the adventure to start
                again.
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <p>Choose a game, pal.</p>
        </>
      )}
    </>
  );
}

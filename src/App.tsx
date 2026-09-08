import React, { useState } from "react";

type ItemAmount = {
  item: string;
  amount: number;
};

type GameStateCondition = {
  type: string;
};

type GameStateConditionItemCountRange = GameStateCondition & {
  type: "ItemCount";
  item: string;
  min?: number;
  max?: number;
};

// Pray that the author didn't mess it up and not include the other required properties
function isItemCountRangeCondition(
  condition: GameStateCondition,
): condition is GameStateConditionItemCountRange {
  return condition.type === "ItemCount";
}

type CyoaChoiceAction = {
  [index: string]: unknown;
  type: string;
};

type CyoaChoiceActionModifyItem = CyoaChoiceAction & ItemAmount;

type CyoaChoice = {
  content: string;
  next: string;
  hidden?: boolean;
  requirements: GameStateCondition[];
  actions: CyoaChoiceAction[];
};

/**
 * Information on how a choice should be shown to the player
 */
type CyoaChoiceDisplayState = {
  choice: CyoaChoice;
  unavailable: boolean;
};

type CyoaStoryNode = {
  content: string;
  choices: CyoaChoice[];
};

type CyoaGame = {
  metadata: {
    title: string;
    author: string;
    version: string;
  };
  nodes: Record<string, CyoaStoryNode>;
};

/**
 * The player's game state.
 */
type CyoaGameState = {
  inventory: Record<string, ItemAmount>;
};

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

function choiceActionAddItem(
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

function onSelectChoice(
  choice: CyoaChoice,
  setCurrentNode: React.Dispatch<React.SetStateAction<string>>,
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>,
  gameState: CyoaGameState,
  setGameState: React.Dispatch<React.SetStateAction<CyoaGameState>>,
) {
  if (choice.actions) {
    for (const action of choice.actions) {
      if (action.type === "AddItem") {
        choiceActionAddItem(
          action as CyoaChoiceActionModifyItem,
          gameState,
          setGameState,
        );
      }
    }
  }

  setCurrentNode(choice.next);
  setCurrentSection(choice.content);
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

function gameStateSatisfiesConditions(
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

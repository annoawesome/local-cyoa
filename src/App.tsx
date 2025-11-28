import React, { useState } from "react";

type ItemAmount = {
  item: string;
  amount: number;
};

type CyoaChoiceAction = {
  [index: string]: unknown;
  type: string;
};

type CyoaChoiceActionModifyItem = CyoaChoiceAction & ItemAmount;

type CyoaChoice = {
  content: string;
  next: string;
  actions: CyoaChoiceAction[];
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
  content: Record<string, CyoaStoryNode>;
};

type CyoaGameState = {
  inventory: Record<string, ItemAmount>;
};

function Topbar({ setGame }: { setGame: React.Dispatch<unknown> }) {
  const [file, setFile] = useState<File>(null);

  return (
    <nav id="topbar">
      <input
        type="file"
        name=""
        id=""
        accept=".json"
        onChange={(ev) => {
          const selectedFile = ev.target.files[0];

          if (selectedFile) {
            setFile(selectedFile);
          }
        }}
      />
      <button
        type="button"
        onClick={() => {
          if (file) {
            file.text().then((text) => {
              const json = JSON.parse(text);
              setGame(json);
            });
          }
        }}
      >
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
  return (
    <div id="body-text" className="width-slim margin-auto">
      {section ? <h2>{section}</h2> : ""}
      <p>{text}</p>
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
  for (const action of choice.actions) {
    if (action.type === "AddItem") {
      choiceActionAddItem(
        action as CyoaChoiceActionModifyItem,
        gameState,
        setGameState,
      );
    }
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
  const choiceList = choices.map((choice, i) => (
    <button
      className="btn-choice"
      key={i}
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
  ));

  return (
    <div className="width-slim margin-auto flex-column gap-16px">
      {choiceList}
    </div>
  );
}

export default function App() {
  const [game, setGame] = useState<CyoaGame>(null);
  const [currentNode, setCurrentNode] = useState("start");
  const [currentSection, setCurrentSection] = useState("");
  const [gameState, setGameState] = useState<CyoaGameState>({
    inventory: {},
  });

  return (
    <>
      <Topbar setGame={setGame} />
      {game ? (
        <>
          <GameInfo title={game.metadata.title} author={game.metadata.author} />
          <BodyText
            text={game.content[currentNode].content}
            section={currentSection}
          />
          <ChoiceList
            choices={game.content[currentNode].choices}
            setCurrentNode={setCurrentNode}
            setCurrentSection={setCurrentSection}
            gameState={gameState}
            setGameState={setGameState}
          />
        </>
      ) : (
        <>
          <p>Choose a game, pal.</p>
        </>
      )}
    </>
  );
}

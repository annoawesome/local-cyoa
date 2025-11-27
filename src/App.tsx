import React, { useState } from "react";

type CyoaChoice = {
  content: string;
  next: string;
};

type CyoaStoryNode = {
  content: string;
  choices: CyoaChoice[];
};

type CyoaGame = {
  metadata: unknown;
  content: Record<string, CyoaStoryNode>;
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

function BodyText({ text }: { text: string }) {
  return (
    <div id="body-text">
      <p>{text}</p>
    </div>
  );
}

function ChoiceList({
  choices,
  setCurrentNode,
}: {
  choices: CyoaChoice[];
  setCurrentNode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const choiceList = choices.map((choice, i) => (
    <button
      className="btn-choice"
      key={i}
      onClick={() => {
        setCurrentNode(choice.next);
      }}
    >
      {choice.content}
    </button>
  ));

  return choiceList;
}

export default function App() {
  const [game, setGame] = useState<CyoaGame>(null);
  const [currentNode, setCurrentNode] = useState("start");

  return (
    <>
      <Topbar setGame={setGame} />
      {game ? (
        <>
          <BodyText text={game.content[currentNode].content} />
          <ChoiceList
            choices={game.content[currentNode].choices}
            setCurrentNode={setCurrentNode}
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

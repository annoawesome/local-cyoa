import type { CyoaGame, CyoaGameState } from "./game/gameTypes.js";

import textJson from "./text.json" with { type: "json" };

import React, { useState } from "react";
import { getEmptyGameState } from "./game/gameState.js";
import ChoiceList from "./component/ChoiceList.js";
import Topbar from "./component/Topbar.js";

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

export default function App() {
  const [game, setGame] = useState<CyoaGame | null>(null);
  const [currentNode, setCurrentNode] = useState("start");
  const [currentSection, setCurrentSection] = useState("");
  const [gameState, setGameState] =
    useState<CyoaGameState>(getEmptyGameState());

  const resetGameState = () => {
    setCurrentNode("start");
    setCurrentSection("");
    setGameState(getEmptyGameState());
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
              <BodyText text={textJson.NonexistentNode} section="Oops!" />
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

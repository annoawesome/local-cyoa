import React, { useState } from "react";

import game from "./game.json" with { type: "json" };

function Topbar() {
  return (
    <nav id="topbar">
      <input type="file" name="" id="" />
      <button type="button">Load Adventure</button>
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

type Choice = {
  content: string;
  next: string;
};

function ChoiceList({
  choices,
  setCurrentNode,
}: {
  choices: Choice[];
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
  const [currentNode, setCurrentNode] = useState("start");

  return (
    <>
      <Topbar />
      <BodyText text={game.content[currentNode].content} />
      <ChoiceList
        choices={game.content[currentNode].choices}
        setCurrentNode={setCurrentNode}
      />
    </>
  );
}

import React from "react";

import game from "./game.json" with { type: "json" }

function Topbar() {
  return <nav id="topbar">
    <input type="file" name="" id="" />
    <button type="button">Load Adventure</button>
  </nav>
}

function BodyText({text}: {text: string}) {
  return <div id="body-text">
    <p>{text}</p>
  </div>
}

type Choice = {
  content: string,
  next: string,
}

function ChoiceList({choices}: {choices: Choice[]}) {
  const choiceList = choices.map((choice, i) => <button className="btn-choice" key={i}>{choice.content}</button>);

  return choiceList;
}

export default function App() {
  return (
    <>
      <Topbar />
      <BodyText text={game.content.start.content} />
      <ChoiceList choices={game.content.start.choices} />
    </>
  );
}

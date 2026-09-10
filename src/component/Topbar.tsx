import type { CyoaGame } from "../game/gameTypes.js";

import React, { useState } from "react";

export default function Topbar({
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

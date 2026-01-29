import { useEffect, useState } from "react";

const COLOR_POOL = [
  "#e63946",
  "#f4a261",
  "#2a9d8f",
  "#457b9d",
  "#f6bd60",
  "#84a59d",
  "#f28482",
  "#277da1",
  "#90be6d",
  "#f94144",
  "#f8961e",
  "#43aa8b",
];

const TOTAL_TILES = 8;

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function countMatches(visible, hidden) {
  return visible.reduce(
    (total, color, index) => total + (color === hidden[index] ? 1 : 0),
    0
  );
}

function generateGame() {
  const colors = shuffle(COLOR_POOL).slice(0, TOTAL_TILES);
  const hidden = shuffle(colors);
  let visible = shuffle(colors);
  let attempts = 0;

  while (countMatches(visible, hidden) !== 0 && attempts < 200) {
    visible = shuffle(colors);
    attempts += 1;
  }

  if (countMatches(visible, hidden) !== 0) {
    visible = hidden.slice(1).concat(hidden[0]);
  }

  return { hidden, visible };
}

export default function App() {
  const [hidden, setHidden] = useState([]);
  const [visible, setVisible] = useState([]);
  const [matches, setMatches] = useState(0);
  const [steps, setSteps] = useState(0);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const game = generateGame();
    setHidden(game.hidden);
    setVisible(game.visible);
    setMatches(countMatches(game.visible, game.hidden));
    setSteps(0);
    setSelected(null);
    setGameOver(false);
  }, []);

  const handleTileClick = (index) => {
    if (gameOver || !visible.length) {
      return;
    }

    if (selected === null) {
      setSelected(index);
      return;
    }

    if (selected === index) {
      setSelected(null);
      return;
    }

    const next = [...visible];
    [next[selected], next[index]] = [next[index], next[selected]];

    const nextMatches = countMatches(next, hidden);

    setVisible(next);
    setMatches(nextMatches);
    setSteps((current) => current + 1);
    setSelected(null);

    if (nextMatches === hidden.length) {
      setGameOver(true);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Blind Color Match</p>
        <h1>Swap the colors until every position matches.</h1>
        <p className="subtitle">
          The hidden row stays covered until you perfectly match every tile.
        </p>
      </header>

      <section className="hud">
        <div className="stat">
          <span className="label">Matches</span>
          <span className="value">
            {matches} / {hidden.length}
          </span>
        </div>
        <div className="stat">
          <span className="label">Steps</span>
          <span className="value">{steps}</span>
        </div>
      </section>

      <section className="board">
        <div className="row">
          {hidden.map((color, index) => (
            <div
              key={`hidden-${color}-${index}`}
              className={`tile hidden ${gameOver ? "revealed" : "covered"}`}
              style={gameOver ? { backgroundColor: color } : undefined}
              aria-label={
                gameOver
                  ? `Hidden color ${index + 1} revealed`
                  : "Hidden color"
              }
            >
              {!gameOver && <span className="hint">?</span>}
            </div>
          ))}
        </div>

        <div className="row">
          {visible.map((color, index) => (
            <button
              key={`visible-${color}-${index}`}
              type="button"
              className={`tile visible ${selected === index ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => handleTileClick(index)}
              aria-pressed={selected === index}
              aria-label={`Visible color ${index + 1}`}
              disabled={gameOver}
            />
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>
          Click two visible tiles to swap them. No matches at the start, so the
          counter begins at zero.
        </p>
        {gameOver && <p className="win">All colors matched. Hidden row revealed!</p>}
      </footer>
    </div>
  );
}

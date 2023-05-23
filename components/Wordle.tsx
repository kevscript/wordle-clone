"use client";
import { useEffect, useState } from "react";

type WordleProps = {
  word: string;
  maxAttempts: number;
};

type RowProps = {
  letters: Letter[];
  word: string;
};

type CellProps = {
  letter: Letter;
};

type Letter = {
  value: string;
  status: "same" | "present" | "wrong";
};

const Row = ({ letters, word }: RowProps) => {
  return (
    <ul className="flex gap-1">
      {Array.from(word).map((w, i) => (
        <Cell key={`${w}_${i}`} letter={letters[i]} />
      ))}
    </ul>
  );
};

const Cell = ({ letter }: CellProps) => {
  if (letter) {
    return (
      <li
        className={`flex items-center justify-center w-8 h-8 border ${
          letter.status === "same"
            ? "bg-green-400"
            : letter.status === "present"
            ? "bg-yellow-300"
            : "bg-transparent"
        }`}
      >
        {letter ? letter.value.toUpperCase() : ""}
      </li>
    );
  }

  return <li className="flex items-center justify-center w-8 h-8 border"></li>;
};

const Wordle = ({ word, maxAttempts }: WordleProps) => {
  const [status, setStatus] = useState<"playing" | "win" | "lose">("playing");
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [rows, setRows] = useState<Letter[][]>(() =>
    Array.from({ length: maxAttempts }).map(() => [])
  );

  useEffect(() => {
    document.addEventListener("keyup", onNewChar);
    return () => document.removeEventListener("keyup", onNewChar);
  });

  function submitAttempt() {
    let activeRow = rows[activeRowIndex];
    if (activeRow.length === word.length) {
      parseAttempt();
    }
  }

  function parseAttempt() {
    let newRows = [...rows];
    let activeRow = newRows[activeRowIndex];

    let indexes: { [key: string]: number[] } = {};

    word.split("").forEach((letter, i) => {
      indexes[letter] ? indexes[letter].push(i) : (indexes[letter] = [i]);
    });

    activeRow.forEach((letter, i) => {
      if (indexes[letter.value]) {
        if (indexes[letter.value].includes(i)) {
          letter.status = "same";
        } else {
          letter.status = "present";
        }
      }
    });

    setRows(newRows);

    // check how many sames
    const filterSames = activeRow.filter((l) => l.status === "same");
    if (filterSames.length === word.length) {
      setStatus("win");
    } else {
      if (activeRowIndex < maxAttempts - 1) {
        setActiveRowIndex((curr) => curr + 1);
      } else {
        setStatus("lose");
      }
    }
  }

  function deleteLetter() {
    let newRows = [...rows];
    let activeRow = newRows[activeRowIndex];

    if (activeRow.length) {
      activeRow.pop();
    }

    setRows(newRows);
  }

  function onNewChar(e: KeyboardEvent) {
    let newRows = [...rows];
    let activeRow = newRows[activeRowIndex];

    if (e.key === "Backspace") deleteLetter();
    if (e.key === "Enter") submitAttempt();

    if (
      e.key.length === 1 &&
      e.key.match(/[a-z]/i) &&
      activeRow.length < word.length
    ) {
      activeRow.push({ value: e.key, status: "wrong" });
      setRows(newRows);
    }
  }

  return (
    <div>
      <h1>Wordle</h1>
      <ul className="flex flex-col gap-2">
        {rows &&
          rows.map((row, i) => <Row key={i} letters={row} word={word} />)}
      </ul>

      {status === "win" && <h1>GG YOU WON</h1>}
      {status === "lose" && <h1>LOL LOSER</h1>}
    </div>
  );
};

export default Wordle;

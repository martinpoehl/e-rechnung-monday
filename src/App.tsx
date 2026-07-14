import { useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";
import { BoardView } from "./components/BoardView";
import { STRINGS, resolveLang } from "./lib/i18n";

const monday = mondaySdk();

interface MondayContext {
  boardId?: number;
  boardIds?: number[];
  theme?: string;
  user?: { currentLanguage?: string };
}

export default function App() {
  const [context, setContext] = useState<MondayContext | null>(null);

  useEffect(() => {
    monday.listen("context", (res) => setContext(res.data as MondayContext));
  }, []);

  const boardId = context?.boardId ?? context?.boardIds?.[0];
  // monday-Themes: "light" | "dark" | "black" – Textfarbe entsprechend wählen.
  const dark = context?.theme === "dark" || context?.theme === "black";
  const mondayLang = context?.user?.currentLanguage;
  const strings = STRINGS[resolveLang(mondayLang)];

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        padding: "1.5rem",
        color: dark ? "#d5d8df" : "#323338",
      }}
    >
      <h1 style={{ fontSize: "1.25rem" }}>{strings.title}</h1>
      {boardId ? (
        <BoardView boardId={boardId} dark={dark} mondayLang={mondayLang} />
      ) : (
        <p>{strings.waitingContext}</p>
      )}
      <footer style={{ marginTop: "1.5rem", opacity: 0.75 }}>
        <a
          href="./help/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit" }}
        >
          {strings.help}
        </a>
      </footer>
    </main>
  );
}

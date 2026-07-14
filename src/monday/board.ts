import mondaySdk from "monday-sdk-js";
import type { MondayClientSdk } from "monday-sdk-js";
import type { MondayItem } from "../lib/erechnung/types";

export interface BoardColumn { id: string; title: string; }

/**
 * Minimale GraphQL-Oberfläche des monday-SDK, injizierbar für Tests.
 * Produktiv wird `monday.api` verwendet (Credentials des eingeloggten Users).
 */
export type GraphQLApi = (
  query: string,
  options?: { variables?: Record<string, unknown> },
) => Promise<{ data: any }>;

let sdk: MondayClientSdk | undefined;

const defaultApi: GraphQLApi = (query, options) => {
  sdk ??= mondaySdk();
  return sdk.api(query, options);
};

export async function getBoardColumns(
  boardId: string | number,
  api: GraphQLApi = defaultApi,
): Promise<BoardColumn[]> {
  const query = `query ($boardId: [ID!]) {
    boards(ids: $boardId) { columns { id title } }
  }`;
  const res = await api(query, { variables: { boardId: [String(boardId)] } });
  const board = res.data?.boards?.[0];
  if (!board) throw new Error(`Board ${boardId} nicht gefunden oder kein Zugriff.`);
  return (board.columns ?? []).map((c: any) => ({ id: String(c.id), title: c.title ?? "" }));
}

export async function getBoardItems(
  boardId: string | number,
  api: GraphQLApi = defaultApi,
): Promise<MondayItem[]> {
  // items_page liefert max. 500 Items pro Seite; weitere Seiten via Cursor.
  const query = `query ($boardId: [ID!], $cursor: String) {
    boards(ids: $boardId) {
      items_page(limit: 100, cursor: $cursor) {
        cursor
        items { id name column_values { id text } }
      }
    }
  }`;

  const items: MondayItem[] = [];
  let cursor: string | null = null;
  do {
    const res = await api(query, {
      variables: { boardId: [String(boardId)], cursor },
    });
    const page = res.data?.boards?.[0]?.items_page;
    if (!page) throw new Error(`Board ${boardId} nicht gefunden oder kein Zugriff.`);
    for (const item of page.items ?? []) {
      const name = item.name ?? "";
      items.push({
        id: String(item.id),
        name,
        columnValues: [
          // monday liefert die Namensspalte nicht in column_values; als
          // Pseudo-Spalte einfügen, damit ein Mapping auf "Name" funktioniert.
          { id: "name", text: name },
          ...(item.column_values ?? []).map((c: any) => ({
            id: String(c.id),
            text: c.text ?? "",
          })),
        ],
      });
    }
    cursor = page.cursor ?? null;
  } while (cursor);

  return items;
}

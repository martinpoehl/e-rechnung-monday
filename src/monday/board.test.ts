import { describe, it, expect, vi } from "vitest";
import { getBoardColumns, getBoardItems } from "./board";
import type { GraphQLApi } from "./board";

const columnsResponse = {
  data: {
    boards: [
      { columns: [{ id: "c1", title: "Kunde" }, { id: "c10", title: "Betrag" }] },
    ],
  },
};

describe("getBoardColumns", () => {
  it("liest Spalten des Boards", async () => {
    const api: GraphQLApi = vi.fn().mockResolvedValue(columnsResponse);
    const cols = await getBoardColumns("123", api);
    expect(cols).toEqual([
      { id: "c1", title: "Kunde" },
      { id: "c10", title: "Betrag" },
    ]);
    expect(api).toHaveBeenCalledWith(
      expect.stringContaining("columns"),
      expect.objectContaining({ variables: expect.objectContaining({ boardId: ["123"] }) }),
    );
  });

  it("wirft verständlichen Fehler, wenn Board fehlt", async () => {
    const api: GraphQLApi = vi.fn().mockResolvedValue({ data: { boards: [] } });
    await expect(getBoardColumns("999", api)).rejects.toThrow(/999/);
  });
});

describe("getBoardItems", () => {
  it("mappt Items und ersetzt null-Text durch leeren String", async () => {
    const api: GraphQLApi = vi.fn().mockResolvedValue({
      data: {
        boards: [
          {
            items_page: {
              cursor: null,
              items: [
                {
                  id: 1,
                  name: "Rechnung Muster",
                  column_values: [
                    { id: "c1", text: "Muster AG" },
                    { id: "c2", text: null },
                  ],
                },
              ],
            },
          },
        ],
      },
    });
    const items = await getBoardItems("123", api);
    expect(items).toEqual([
      {
        id: "1",
        name: "Rechnung Muster",
        columnValues: [
          // Item-Name als Pseudo-Spalte "name", damit das Mapping auf die
          // monday-Namensspalte funktioniert (GraphQL liefert sie nicht mit).
          { id: "name", text: "Rechnung Muster" },
          { id: "c1", text: "Muster AG" },
          { id: "c2", text: "" },
        ],
      },
    ]);
  });

  it("folgt dem Cursor über mehrere Seiten", async () => {
    const page = (cursor: string | null, id: string) => ({
      data: {
        boards: [
          {
            items_page: {
              cursor,
              items: [{ id, name: `Item ${id}`, column_values: [] }],
            },
          },
        ],
      },
    });
    const api = vi
      .fn()
      .mockResolvedValueOnce(page("CURSOR-1", "1"))
      .mockResolvedValueOnce(page(null, "2"));
    const items = await getBoardItems("123", api as GraphQLApi);
    expect(items.map((i) => i.id)).toEqual(["1", "2"]);
    expect(api).toHaveBeenCalledTimes(2);
    expect((api as ReturnType<typeof vi.fn>).mock.calls[1][1]).toEqual(
      expect.objectContaining({ variables: expect.objectContaining({ cursor: "CURSOR-1" }) }),
    );
  });

  it("wirft verständlichen Fehler, wenn Board fehlt", async () => {
    const api: GraphQLApi = vi.fn().mockResolvedValue({ data: { boards: [] } });
    await expect(getBoardItems("999", api)).rejects.toThrow(/999/);
  });
});

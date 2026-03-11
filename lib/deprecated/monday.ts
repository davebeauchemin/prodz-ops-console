/**
 * @deprecated Use lib/monday.ts (v2) for new Monday table schema.
 */
import type { MondayItem } from "./mapping";

const MONDAY_API_URL = "https://api.monday.com/v2";

async function safeJsonFromResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Monday API returned non-JSON (${res.status}): ${text.slice(0, 300)}`
    );
  }
}

interface MondayColumnValue {
  id: string;
  value: string;
  text?: string;
}

interface MondayItemRaw {
  id: string;
  name: string;
  group: { title: string };
  column_values: MondayColumnValue[];
}

interface MondayBoardResponse {
  data?: {
    boards: Array<{
      items_page: {
        cursor: string | null;
        items: MondayItemRaw[];
      };
    }>;
  };
  errors?: Array<{ message: string }>;
}

function parseDateFromValue(value: string): string | null {
  try {
    const parsed = JSON.parse(value || "{}");
    const date = parsed.date;
    if (typeof date === "string") {
      return date.split("T")[0] ?? date;
    }
    return null;
  } catch {
    return null;
  }
}

function parseDropdownValue(cv: MondayColumnValue): string | string[] {
  if (cv.text) return cv.text;
  try {
    const parsed = JSON.parse(cv.value || "{}");
    if (parsed.labels && Array.isArray(parsed.labels)) {
      return parsed.labels;
    }
    if (parsed.label_ids && Array.isArray(parsed.label_ids)) {
      return parsed.label_ids.map(String);
    }
    if (parsed.label) return parsed.label;
    return "";
  } catch {
    return "";
  }
}

function parseActionsValue(cv: MondayColumnValue): string[] {
  const v = parseDropdownValue(cv);
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "string" && v) {
    return v
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseItem(
  item: MondayItemRaw,
  targetDate: string,
  dateCol: MondayColumnValue | undefined,
  setterCol: MondayColumnValue | undefined,
  callStatusCol: MondayColumnValue | undefined,
  actionsCol: MondayColumnValue | undefined,
  leadLifecycleCol: MondayColumnValue | undefined
): MondayItem | null {
  const itemDate = dateCol ? parseDateFromValue(dateCol.value) : null;
  if (itemDate !== targetDate) return null;

  const setter = setterCol ? String(parseDropdownValue(setterCol)) : "";
  const callStatus = callStatusCol
    ? String(parseDropdownValue(callStatusCol))
    : "";
  const actions = actionsCol ? parseActionsValue(actionsCol) : [];
  const leadLifecycle = leadLifecycleCol
    ? String(parseDropdownValue(leadLifecycleCol))
    : "";

  return { setter, callStatus, actions, leadLifecycle };
}

function parseItemWithDate(
  item: MondayItemRaw,
  dateCol: MondayColumnValue | undefined,
  setterCol: MondayColumnValue | undefined,
  callStatusCol: MondayColumnValue | undefined,
  actionsCol: MondayColumnValue | undefined,
  leadLifecycleCol: MondayColumnValue | undefined
): (MondayItem & { date: string }) | null {
  const itemDate = dateCol ? parseDateFromValue(dateCol.value) : null;
  if (!itemDate) return null;

  const setter = setterCol ? String(parseDropdownValue(setterCol)) : "";
  const callStatus = callStatusCol
    ? String(parseDropdownValue(callStatusCol))
    : "";
  const actions = actionsCol ? parseActionsValue(actionsCol) : [];
  const leadLifecycle = leadLifecycleCol
    ? String(parseDropdownValue(leadLifecycleCol))
    : "";

  return { setter, callStatus, actions, leadLifecycle, date: itemDate };
}

async function fetchColumnIds(
  apiToken: string,
  boardId: string
): Promise<Record<string, string>> {
  const query = `
    query {
      boards(ids: ${boardId}) {
        columns { id title }
      }
    }
  `;
  const res = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiToken,
    },
    body: JSON.stringify({ query }),
  });
  const json = (await safeJsonFromResponse(res)) as {
    data?: { boards: Array<{ columns: Array<{ id: string; title: string }> }> };
    errors?: Array<{ message: string }>;
  };
  if (json.errors?.length) {
    throw new Error(`Monday API error: ${json.errors[0].message}`);
  }
  const cols = json.data?.boards?.[0]?.columns ?? [];
  const map: Record<string, string> = {};
  for (const c of cols) {
    map[c.id] = c.title ?? "";
  }
  return map;
}

export async function fetchItemsByDate(
  apiToken: string,
  boardId: string,
  date: string
): Promise<MondayItem[]> {
  const targetDate = date.includes("T")
    ? date.split("T")[0]
    : date.split(" ")[0];
  const allItems: MondayItem[] = [];
  let cursor: string | null = null;

  const columnIds = await fetchColumnIds(apiToken, boardId);
  const idFor = (title: string) =>
    Object.entries(columnIds).find(
      ([, t]) => t?.toLowerCase() === title.toLowerCase()
    )?.[0];
  const dateColId = idFor("Date");
  const setterColId = idFor("Setter");
  const callStatusColId = idFor("Call Status");
  const actionsColId = idFor("Actions");
  const leadLifecycleColId = idFor("Lead Lifecycle");

  const findCol = (cols: MondayColumnValue[], colId: string | undefined) =>
    colId ? cols.find((c) => c.id === colId) : undefined;

  do {
    const query = cursor
      ? `
        query {
          next_items_page(cursor: ${JSON.stringify(cursor)}) {
            cursor
            items {
              id
              name
              group { title }
              column_values { id value text }
            }
          }
        }
      `
      : `
        query {
          boards(ids: ${boardId}) {
            items_page {
              cursor
              items {
                id
                name
                group { title }
                column_values { id value text }
              }
            }
          }
        }
      `;

    const res = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiToken,
      },
      body: JSON.stringify({ query }),
    });

    const json = (await safeJsonFromResponse(res)) as MondayBoardResponse;
    if (json.errors?.length) {
      throw new Error(`Monday API error: ${json.errors[0].message}`);
    }

    let items: MondayItemRaw[] = [];
    let nextCursor: string | null = null;

    if (cursor) {
      const page = (json as { data?: { next_items_page: { cursor: string | null; items: MondayItemRaw[] } } }).data?.next_items_page;
      if (page) {
        items = page.items ?? [];
        nextCursor = page.cursor;
      }
    } else {
      const boards = json.data?.boards;
      if (!boards?.length) return [];
      const board = boards[0];
      const page = board.items_page;
      items = page?.items ?? [];
      nextCursor = page?.cursor ?? null;
    }

    const dailyReportItems = items.filter(
      (item) => item.group?.title?.toLowerCase() === "daily report"
    );

    for (const item of dailyReportItems) {
      const cols = item.column_values ?? [];
      const dateCol = findCol(cols, dateColId);
      const setterCol = findCol(cols, setterColId);
      const callStatusCol = findCol(cols, callStatusColId);
      const actionsCol = findCol(cols, actionsColId);
      const leadLifecycleCol = findCol(cols, leadLifecycleColId);

      const parsed = parseItem(
        item,
        targetDate,
        dateCol,
        setterCol,
        callStatusCol,
        actionsCol,
        leadLifecycleCol
      );
      if (parsed) allItems.push(parsed);
    }

    cursor = nextCursor;
  } while (cursor);

  return allItems;
}

export async function fetchAllItemsInDateRange(
  apiToken: string,
  boardId: string,
  startDate: string,
  endDate: string
): Promise<Map<string, MondayItem[]>> {
  const start = startDate.includes("T") ? startDate.split("T")[0] : startDate.split(" ")[0];
  const end = endDate.includes("T") ? endDate.split("T")[0] : endDate.split(" ")[0];

  const columnIds = await fetchColumnIds(apiToken, boardId);
  const idFor = (title: string) =>
    Object.entries(columnIds).find(
      ([, t]) => t?.toLowerCase() === title.toLowerCase()
    )?.[0];
  const dateColId = idFor("Date");
  const setterColId = idFor("Setter");
  const callStatusColId = idFor("Call Status");
  const actionsColId = idFor("Actions");
  const leadLifecycleColId = idFor("Lead Lifecycle");

  const findCol = (cols: MondayColumnValue[], colId: string | undefined) =>
    colId ? cols.find((c) => c.id === colId) : undefined;

  const itemsByDate = new Map<string, MondayItem[]>();
  let cursor: string | null = null;

  do {
    const query = cursor
      ? `
        query {
          next_items_page(cursor: ${JSON.stringify(cursor)}) {
            cursor
            items {
              id
              name
              group { title }
              column_values { id value text }
            }
          }
        }
      `
      : `
        query {
          boards(ids: ${boardId}) {
            items_page {
              cursor
              items {
                id
                name
                group { title }
                column_values { id value text }
              }
            }
          }
        }
      `;

    const res = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiToken,
      },
      body: JSON.stringify({ query }),
    });

    const json = (await safeJsonFromResponse(res)) as MondayBoardResponse;
    if (json.errors?.length) {
      throw new Error(`Monday API error: ${json.errors[0].message}`);
    }

    let items: MondayItemRaw[] = [];
    let nextCursor: string | null = null;

    if (cursor) {
      const page = (json as { data?: { next_items_page: { cursor: string | null; items: MondayItemRaw[] } } }).data?.next_items_page;
      if (page) {
        items = page.items ?? [];
        nextCursor = page.cursor;
      }
    } else {
      const boards = json.data?.boards;
      if (!boards?.length) return itemsByDate;
      const board = boards[0];
      const page = board.items_page;
      items = page?.items ?? [];
      nextCursor = page?.cursor ?? null;
    }

    const dailyReportItems = items.filter(
      (item) => item.group?.title?.toLowerCase() === "daily report"
    );

    for (const item of dailyReportItems) {
      const cols = item.column_values ?? [];
      const dateCol = findCol(cols, dateColId);
      const setterCol = findCol(cols, setterColId);
      const callStatusCol = findCol(cols, callStatusColId);
      const actionsCol = findCol(cols, actionsColId);
      const leadLifecycleCol = findCol(cols, leadLifecycleColId);

      const parsed = parseItemWithDate(
        item,
        dateCol,
        setterCol,
        callStatusCol,
        actionsCol,
        leadLifecycleCol
      );
      if (!parsed) continue;

      const { date: itemDate, ...mondayItem } = parsed;
      if (itemDate >= start && itemDate <= end) {
        const list = itemsByDate.get(itemDate) ?? [];
        list.push(mondayItem);
        itemsByDate.set(itemDate, list);
      }
    }

    cursor = nextCursor;
  } while (cursor);

  return itemsByDate;
}

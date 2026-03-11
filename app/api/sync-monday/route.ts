import { NextResponse } from "next/server";
import { fetchAllItemsInDateRange } from "@/lib/monday";
import {
  aggregateItems,
  aggregatedToTableRow,
  SETTER_TO_SHEET_TAB,
} from "@/lib/mapping";

const DEBUG = process.env.DEBUG_SYNC === "true";

function debug(...args: unknown[]) {
  if (DEBUG) {
    console.log("[sync-monday]", new Date().toISOString(), ...args);
  }
}

/** Parse "YYYY-MM-DD" into components. All logic is date-only (no timestamps/timezones). */
function parseYMD(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
}

function formatYMD(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function isBeforeOrEqual(
  a: { y: number; m: number; d: number },
  b: { y: number; m: number; d: number }
): boolean {
  if (a.y !== b.y) return a.y < b.y;
  if (a.m !== b.m) return a.m < b.m;
  return a.d <= b.d;
}

function addOneDay(y: number, m: number, d: number): { y: number; m: number; d: number } {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  if (isLeap) daysInMonth[1] = 29;
  d += 1;
  if (d > daysInMonth[m - 1]) {
    d = 1;
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return { y, m, d };
}

function* datesInRange(startDate: string, endDate: string): Generator<string> {
  let current = parseYMD(startDate);
  const end = parseYMD(endDate);
  while (isBeforeOrEqual(current, end)) {
    yield formatYMD(current.y, current.m, current.d);
    current = addOneDay(current.y, current.m, current.d);
  }
}

export async function POST(request: Request) {
  try {
    debug("POST /api/sync-monday started");
    const body = await request.json().catch(() => ({}));
    const startDate = body.startDate;
    const endDate = body.endDate;
    const setter = body.setter;
    debug("Request body:", { startDate, endDate, setter, bodyKeys: Object.keys(body) });

    if (!startDate || typeof startDate !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'startDate' (expected YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    if (!endDate || typeof endDate !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'endDate' (expected YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    if (!setter || typeof setter !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'setter'" },
        { status: 400 }
      );
    }

    const apiToken = process.env.MONDAY_API_TOKEN;
    const boardId = process.env.MONDAY_BOARD_ID;

    if (!apiToken || !boardId) {
      return NextResponse.json(
        { error: "Missing env: MONDAY_API_TOKEN or MONDAY_BOARD_ID" },
        { status: 500 }
      );
    }

    const reverseMapping: Record<string, string> = {};
    for (const [name, tab] of Object.entries(SETTER_TO_SHEET_TAB)) {
      reverseMapping[tab] = name;
    }
    const setterMondayName = reverseMapping[setter];
    if (!setterMondayName) {
      return NextResponse.json(
        { error: `Unknown setter: ${setter}` },
        { status: 400 }
      );
    }

    const rows: { date: string; dials: number; pickedUp: number; callBooked: number; rappelMoi: number; dq: number; fup: number; showedCall: number; close: number }[] = [];

    const itemsByDate = await fetchAllItemsInDateRange(
      apiToken,
      boardId,
      startDate,
      endDate
    );

    for (const date of datesInRange(startDate, endDate)) {
      const items = (itemsByDate.get(date) ?? []).filter(
        (i) => i.setter === setterMondayName
      );
      const agg = aggregateItems(items);
      const values = aggregatedToTableRow(agg);
      rows.push({
        date,
        dials: values[0] ?? 0,
        pickedUp: values[1] ?? 0,
        callBooked: values[2] ?? 0,
        rappelMoi: values[3] ?? 0,
        dq: values[4] ?? 0,
        fup: values[5] ?? 0,
        showedCall: values[6] ?? 0,
        close: values[7] ?? 0,
      });
    }

    return NextResponse.json({
      success: true,
      startDate,
      endDate,
      setter,
      rows,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[sync-monday] Error:", {
      message,
      name: err instanceof Error ? err.name : undefined,
      stack: err instanceof Error ? err.stack : undefined,
      full: err,
      toString: String(err),
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

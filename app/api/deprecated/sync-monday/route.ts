/**
 * @deprecated Use /api/sync-monday (v2) for new Monday table schema.
 */
import { NextResponse } from "next/server";
import { fetchAllItemsInDateRange } from "@/lib/deprecated/monday";
import {
  aggregateItems,
  aggregatedToTableRow,
  SETTER_TO_SHEET_TAB,
} from "@/lib/deprecated/mapping";
import { datesInRange } from "@/lib/dates";

const DEBUG = process.env.DEBUG_SYNC === "true";

function debug(...args: unknown[]) {
  if (DEBUG) {
    console.log("[sync-monday]", new Date().toISOString(), ...args);
  }
}

export async function POST(request: Request) {
  try {
    debug("POST /api/deprecated/sync-monday started");
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
    const boardId = process.env.MONDAY_BOARD_ID_DEPRECATED;

    if (!apiToken || !boardId) {
      return NextResponse.json(
        { error: "Missing env: MONDAY_API_TOKEN or MONDAY_BOARD_ID_DEPRECATED" },
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

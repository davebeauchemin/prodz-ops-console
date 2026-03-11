"use client";

import { useState } from "react";
import { SETTER_TO_SHEET_TAB } from "@/lib/mapping";

function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const SETTER_OPTIONS = Object.values(SETTER_TO_SHEET_TAB);

interface TableRow {
  date: string;
  dials: number;
  pickedUp: number;
  callBooked: number;
  rappelMoi: number;
  dq: number;
  fup: number;
  showedCall: number;
  close: number;
}

interface FetchResponse {
  success: boolean;
  startDate: string;
  endDate: string;
  setter: string;
  rows: TableRow[];
}

const COLUMNS = [
  "Date",
  "Dials",
  "Picked-up",
  "Call booked",
  "Rappel moi",
  "DQ",
  "FUP",
  "Showed call",
  "Close",
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function groupRowsByMonth(rows: TableRow[]): Map<string, TableRow[]> {
  const byMonth = new Map<string, TableRow[]>();
  for (const row of rows) {
    const month = row.date.slice(0, 7);
    const list = byMonth.get(month) ?? [];
    list.push(row);
    byMonth.set(month, list);
  }
  return byMonth;
}

function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function rowToCellsWithoutDate(row: TableRow): string[] {
  return [
    String(row.dials),
    String(row.pickedUp),
    String(row.callBooked),
    String(row.rappelMoi),
    String(row.dq),
    String(row.fup),
    String(row.showedCall),
    String(row.close),
  ];
}

function rowsToTSVWithoutDate(rows: TableRow[]): string {
  return rows.map((r) => rowToCellsWithoutDate(r).join("\t")).join("\n");
}

export default function Home() {
  const today = formatDateLocal(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [setter, setSetter] = useState(SETTER_OPTIONS[0] ?? "Dave");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FetchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<{ month: string } | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);
    setResult(null);
    setCopyStatus(null);
    try {
      const res = await fetch("/api/sync-monday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, setter }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Fetch failed");
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyMonth(monthKey: string, rows: TableRow[]) {
    const tsv = rowsToTSVWithoutDate(rows);
    try {
      await navigator.clipboard.writeText(tsv);
      setCopyStatus({ month: formatMonthLabel(monthKey) });
      setTimeout(() => setCopyStatus(null), 2000);
    } catch {
      setCopyStatus({ month: "Copy failed" });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-4xl flex-col gap-6 rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Monday Export
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Fetch setter daily reports from Monday.com for a date range. Copy the
          table and paste into your spreadsheet.
        </p>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Start date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              End date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="setter"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Setter
            </label>
            <select
              id="setter"
              value={setter}
              onChange={(e) => setSetter(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {SETTER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleFetch}
          disabled={loading}
          className="w-fit rounded-lg bg-zinc-900 px-4 py-2.5 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Fetching…" : "Fetch from Monday"}
        </button>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {result && result.rows.length > 0 && (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {result.rows.length} row{result.rows.length !== 1 ? "s" : ""} for{" "}
              {result.setter} ({result.startDate} to {result.endDate})
            </p>
            {copyStatus && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                {copyStatus.month === "Copy failed"
                  ? "Copy failed"
                  : `Copied ${copyStatus.month}! Paste into your sheet.`}
              </p>
            )}
            {Array.from(groupRowsByMonth(result.rows).entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([monthKey, monthRows]) => (
                <div
                  key={monthKey}
                  className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      {formatMonthLabel(monthKey)}
                    </h2>
                    <button
                      onClick={() => handleCopyMonth(monthKey, monthRows)}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Copy (no date)
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                          {COLUMNS.map((col) => (
                            <th
                              key={col}
                              className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {monthRows.map((row) => (
                          <tr
                            key={row.date}
                            className="border-b border-zinc-100 dark:border-zinc-800"
                          >
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-900 dark:text-zinc-100">
                              {row.date}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.dials}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.pickedUp}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.callBooked}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.rappelMoi}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.dq}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.fup}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.showedCall}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-zinc-700 dark:text-zinc-300">
                              {row.close}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        )}

        {result && result.rows.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No data for the selected range.
          </p>
        )}
      </main>
    </div>
  );
}

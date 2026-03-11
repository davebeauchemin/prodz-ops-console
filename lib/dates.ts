/** Date range utilities for Monday sync. */

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

function addOneDay(
  y: number,
  m: number,
  d: number
): { y: number; m: number; d: number } {
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

export function* datesInRange(
  startDate: string,
  endDate: string
): Generator<string> {
  let current = parseYMD(startDate);
  const end = parseYMD(endDate);
  while (isBeforeOrEqual(current, end)) {
    yield formatYMD(current.y, current.m, current.d);
    current = addOneDay(current.y, current.m, current.d);
  }
}

/**
 * Mapping from Monday.com v2 table (Action Taken, Action Result) to output columns.
 * See documents/monday-setter-report.md and documents/govente-xlsx.md.
 */

/** Action Taken values that count as Dials (outbound calls) */
const DIALS_ACTIONS = ["Dial - Picked-up", "Dial - Not Connected"];

/** Action Taken that counts as Picked-up */
const PICKED_UP_ACTION = "Dial - Picked-up";

/** Action Result contains (Call booked - Consultation) */
const CALL_BOOKED_CONTAINS = "Scheduled Consultation Appointment";

/** Action Result contains (Rappel moi - Prospection Meeting/Call) */
const RAPPEL_MOI_CONTAINS = "Scheduled Prospecting";

/** Action Result contains (DQ) */
const DQ_CONTAINS = "Disqualified";

/** Action Result contains (FUP) */
const FUP_CONTAINS = "Follow-Up";

/** Action Result contains (Showed call) */
const SHOWED_CALL_CONTAINS = "Showed Call";

/** Setter name (from Monday) -> Sheet tab name */
export const SETTER_TO_SHEET_TAB: Record<string, string> = {
  "Dave Beauchemin": "Dave",
  "David Bélanger": "David",
  "Rosalie Dulac": "Rosalie",
};

export interface AggregatedRow {
  dials: number;
  pickedUp: number;
  callBooked: number;
  rappelMoi: number;
  dq: number;
  fup: number;
  showedCall: number;
  close: number;
}

export interface MondayItem {
  setter: string;
  actionTaken: string[];
  actionResult: string;
  leadName?: string;
}

export function aggregateItems(items: MondayItem[]): AggregatedRow {
  let dials = 0;
  let pickedUp = 0;
  let callBooked = 0;
  let rappelMoi = 0;
  let dq = 0;
  let showedCall = 0;
  const fupLeads = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const hasDialAction = item.actionTaken.some((a) => DIALS_ACTIONS.includes(a));
    if (hasDialAction) dials += 1;

    if (item.actionTaken.includes(PICKED_UP_ACTION)) pickedUp += 1;

    if (item.actionResult.includes(CALL_BOOKED_CONTAINS)) callBooked += 1;
    if (item.actionResult.includes(RAPPEL_MOI_CONTAINS)) rappelMoi += 1;
    if (item.actionResult.includes(DQ_CONTAINS)) dq += 1;
    if (item.actionResult.includes(SHOWED_CALL_CONTAINS)) showedCall += 1;

    if (item.actionResult.includes(FUP_CONTAINS)) {
      const key = item.leadName?.trim() || `item-${i}`;
      fupLeads.add(key);
    }
  }

  return {
    dials,
    pickedUp,
    callBooked,
    rappelMoi,
    dq,
    fup: fupLeads.size,
    showedCall,
    close: 0,
  };
}

export function aggregatedToTableRow(agg: AggregatedRow): number[] {
  return [
    agg.dials,
    agg.pickedUp,
    agg.callBooked,
    agg.rappelMoi,
    agg.dq,
    agg.fup,
    agg.showedCall,
    agg.close,
  ];
}

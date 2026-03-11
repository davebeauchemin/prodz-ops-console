/**
 * Mapping from Monday.com Setters Reports board to Google Sheet columns.
 * LEAD ADS section only. rappelMoi and showedCall left empty.
 */

/** Monday actions ending in "Appointment Booked" */
const CALL_BOOKED_ACTIONS = [
  "Prospection - Appointment Booked",
  "Consultation - Appointment Booked",
  "Finalisation - Appointment Booked",
];

/** Monday actions that count as FUP */
const FUP_ACTIONS = [
  "Follow-up - SMS Sent",
  "Follow-up - Email Sent",
  "Follow-up - Call Made",
];

/** Setter name (from Monday) -> Google Sheet tab name */
export const SETTER_TO_SHEET_TAB: Record<string, string> = {
  "Dave Beauchemin": "Dave",
  "David Bélanger": "David",
};

export interface AggregatedRow {
  dials: number;
  pickedUp: number;
  callBooked: number;
  dq: number;
  fup: number;
}

export interface MondayItem {
  setter: string;
  callStatus: string;
  actions: string[];
  leadLifecycle: string;
}

/**
 * Aggregate Monday items into counts for the Google Sheet LEAD ADS columns.
 * Columns E (rappelMoi) and H (showedCall) are left empty per plan.
 */
export function aggregateItems(items: MondayItem[]): AggregatedRow {
  let dials = 0;
  let pickedUp = 0;
  let callBooked = 0;
  let dq = 0;
  let fup = 0;

  for (const item of items) {
    // Dials = items where a call was made (Call Status = Call Connected or Call Not Connected)
    if (
      item.callStatus === "Call Connected" ||
      item.callStatus === "Call Not Connected"
    ) {
      dials += 1;
    }

    // Picked-up = Call Status = "Call Connected"
    if (item.callStatus === "Call Connected") {
      pickedUp += 1;
    }

    // FUP = items (once per item) with Lead Lifecycle = "Existing Lead" and at least one FUP action
    const hasFupAction = item.actions.some((a) => FUP_ACTIONS.includes(a));
    const isExistingLead =
      item.leadLifecycle === "Existing Lead" ||
      item.leadLifecycle === "Lead Existant";
    if (isExistingLead && hasFupAction) {
      fup += 1;
    }

    for (const action of item.actions) {
      if (CALL_BOOKED_ACTIONS.includes(action)) callBooked += 1;
      if (action === "Lead Disqualified") dq += 1;
    }
  }

  return { dials, pickedUp, callBooked, dq, fup };
}

/**
 * Values for the export table: Dials, Picked-up, Call booked, Rappel moi, DQ, FUP, Showed call, Close.
 * Rappel moi, Showed call, Close default to 0 (not sourced from Monday).
 */
export function aggregatedToTableRow(agg: AggregatedRow): number[] {
  return [
    agg.dials,
    agg.pickedUp,
    agg.callBooked,
    0, // Rappel moi - 0 for now
    agg.dq,
    agg.fup,
    0, // Showed call - 0 for now
    0, // Close - 0 for now
  ];
}

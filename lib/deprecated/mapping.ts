/**
 * Mapping from Monday.com Setters Reports board to Google Sheet columns.
 * LEAD ADS section only.
 * @deprecated Use lib/mapping.ts (v2) for new Monday table schema.
 */

/** Monday actions that count as Call booked (Consultation only) */
const CALL_BOOKED_ACTIONS = ["Consultation - Appointment Booked"];

/** Monday actions that count as Rappel moi (Prospection RDV booked) */
const RAPPEL_MOI_ACTIONS = ["Prospection - Appointment Booked"];

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
  rappelMoi: number;
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
 */
export function aggregateItems(items: MondayItem[]): AggregatedRow {
  let dials = 0;
  let pickedUp = 0;
  let callBooked = 0;
  let rappelMoi = 0;
  let dq = 0;
  let fup = 0;

  for (const item of items) {
    if (
      item.callStatus === "Call Connected" ||
      item.callStatus === "Call Not Connected"
    ) {
      dials += 1;
    }

    if (item.callStatus === "Call Connected") {
      pickedUp += 1;
    }

    const hasFupAction = item.actions.some((a) => FUP_ACTIONS.includes(a));
    const isExistingLead =
      item.leadLifecycle === "Existing Lead" ||
      item.leadLifecycle === "Lead Existant";
    if (isExistingLead && hasFupAction) {
      fup += 1;
    }

    for (const action of item.actions) {
      if (CALL_BOOKED_ACTIONS.includes(action)) callBooked += 1;
      if (RAPPEL_MOI_ACTIONS.includes(action)) rappelMoi += 1;
      if (action === "Lead Disqualified") dq += 1;
    }
  }

  return { dials, pickedUp, callBooked, rappelMoi, dq, fup };
}

export function aggregatedToTableRow(agg: AggregatedRow): number[] {
  return [
    agg.dials,
    agg.pickedUp,
    agg.callBooked,
    agg.rappelMoi,
    agg.dq,
    agg.fup,
    0,
    0,
  ];
}

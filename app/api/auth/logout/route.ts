import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST() {
  try {
    const { cookies } = await import("next/headers");
    const session = await getSession(await cookies());
    session.destroy();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth] Logout error:", err);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}

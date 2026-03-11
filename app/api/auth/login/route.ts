import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = body.password;

    if (typeof password !== "string" || !password) {
      return NextResponse.json(
        { error: "Missing password" },
        { status: 400 }
      );
    }

    const hashedPasswordEncoded = process.env.HASHED_PASSWORD;
    if (!hashedPasswordEncoded) {
      console.error("[auth] HASHED_PASSWORD not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Base64 decode for transport (bcrypt hash has $ which can break .env parsing)
    const hashedPassword =
      hashedPasswordEncoded.startsWith("$2")
        ? hashedPasswordEncoded
        : Buffer.from(hashedPasswordEncoded, "base64").toString("utf-8");

    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const { cookies } = await import("next/headers");
    const session = await getSession(await cookies());
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth] Login error:", err);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

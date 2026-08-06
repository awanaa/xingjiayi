import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, createSession } from "@/lib/cms";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ ok: false, error: "密码错误" }, { status: 401 });
    }
    const token = createSession();
    const cookieStore = await cookies();
    cookieStore.set("cms_session", token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}

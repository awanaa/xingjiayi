import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/cms";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/cms";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (token) {
    deleteSession(token);
  }
  cookieStore.delete("cms_session");
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContent, saveContent, verifySession, SiteContent } from "@/lib/cms";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const content = getContent();
  if (!content) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cms_session")?.value;
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const body = (await req.json()) as SiteContent;
    saveContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith("CMS_GIT_CONFLICT")) {
      return NextResponse.json({ ok: false, error: message }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "Bad Request" }, { status: 400 });
  }
}

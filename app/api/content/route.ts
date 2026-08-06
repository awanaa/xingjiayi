import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/cms";

export async function GET(req: NextRequest) {
  const content = getContent();
  return NextResponse.json(content ?? { ok: false }, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

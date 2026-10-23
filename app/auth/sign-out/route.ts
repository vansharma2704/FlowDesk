import { NextRequest,NextResponse } from "next/server";
import { destroySession,safeReturnTo } from "@/app/password-auth";
export async function GET(request:NextRequest){await destroySession();return NextResponse.redirect(new URL(safeReturnTo(request.nextUrl.searchParams.get("returnTo"),"/"),request.url))}

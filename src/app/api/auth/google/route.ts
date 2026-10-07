import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get("redirect") || "/";

  // TODO: Implement Google OAuth integration
  // This would typically use NextAuth or Google OAuth client

  // For now, redirect to a page that explains Google sign-in is coming soon
  return NextResponse.redirect(new URL("/login?google-coming-soon=1", redirectUrl));
}
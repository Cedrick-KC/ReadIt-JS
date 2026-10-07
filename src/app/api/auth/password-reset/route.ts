import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";
import { createSession, setCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists - return generic message
      return NextResponse.json(
        { success: true, message: "If an account with this email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // TODO: Store reset token in database with expiration
    // For now, we'll just send a response

    // In a real implementation, you would:
    // 1. Store the token hashed in the database
    // 2. Send an email with a reset link
    // 3. When the reset link is clicked, verify the token and allow password reset

    // For now, return success
    return NextResponse.json({
      success: true,
      message: "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Handle the password reset page - show form with token validation
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Invalid reset token" },
      { status: 400 }
    );
  }

  // TODO: Validate token and show reset form
  // For now, return a placeholder page

  return NextResponse.json({
    token,
    message: "Password reset form would be shown here",
  });
}
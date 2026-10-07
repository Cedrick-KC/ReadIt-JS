
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateReviewData {
  workId: string;
  rating: number; // 1-5
  title?: string;
  content?: string;
}

interface UpdateReviewData {
  rating?: number;
  title?: string;
  content?: string;
}

export async function POST(request: Request) {
  try {
    const { workId, rating, title, content } = await request.json();

    if (!workId || !rating) {
      return NextResponse.json(
        { error: "Work ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get the logged-in user's ID from the session cookie
    const sessionCookie = request.headers
      .get("cookie")
      ?.split("; ")
      .find((cookie) => cookie.startsWith("readit_session="));

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "You must be logged in to submit a review" },
        { status: 401 }
      );
    }

    const sessionValue = sessionCookie.split("=")[1];
    const sessionParts = sessionValue.split(".");

    if (sessionParts.length !== 5) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const [userId] = sessionParts;

    // Check if user has already reviewed this work
    const existingReview = await prisma.review.findFirst({
      where: {
        workId,
        userId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this work" },
        { status: 409 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        title,
        content,
        status: "pending",
        userId,
        workId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, rating, title, content } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // TODO: Verify user owns this review or is admin
    const review = await prisma.review.update({
      where: { id },
      data: {
        rating,
        title,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        work: true,
      },
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Review update error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // TODO: Verify user owns this review or is admin
    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Review deletion error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}


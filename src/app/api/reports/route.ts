import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateReportData {
  workId: string;
  type: "copyright" | "inappropriate" | "spam" | "misleading_attribution" | "broken_content" | "abuse" | "other";
  description: string;
}

export async function POST(request: Request) {
  try {
    const { workId, type, description } = await request.json();

    if (!workId || !type || !description) {
      return NextResponse.json(
        { error: "Work ID, type, and description are required" },
        { status: 400 }
      );
    }

    // Check if there's already an open report for this work
    const existingReport = await prisma.report.findFirst({
      where: {
        workId,
        status: "open",
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "A report for this work is already open" },
        { status: 409 }
      );
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        reporterId: "user_123", // TODO: Get from session
        workId,
        type,
        description,
        status: "open",
      },
      include: {
        work: {
          select: {
            id: true,
            title: true,
            creator: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Report creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Handle the reports page - show open reports for moderation
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "open";

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const reports = await prisma.report.findMany({
    where,
    include: {
      work: {
        select: {
          id: true,
          title: true,
          creator: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ reports });
}
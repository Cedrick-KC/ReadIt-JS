import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const model = searchParams.get("model") || "";
    const type = searchParams.get("type") || "";
    const sort = searchParams.get("sort") || "relevance";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 12;

    // Build where clause for Prisma
    const where: any = {
      OR: [
  {
    title: {
      contains: query,
    },
  },
  {
    description: {
      contains: query,
    },
  },
  {
    tags: {
      some: {
        name: {
          contains: query,
        },
      },
    },
  },
],
      status: "PUBLISHED",
      ...(genre && { genre }),
      ...(model && { "aiProvenance.model": model }),
      ...(type && { contentType: type }),
    };

    // Apply sorting
    let orderBy: any = {};
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "most-read":
        orderBy = { views: "desc" };
        break;
      case "most-saved":
        orderBy = { saves: "desc" };
        break;
      case "highest-rated":
        orderBy = { rating: "desc" };
        break;
      case "relevance":
      default:
        orderBy = { createdAt: "desc" };
    }

    // Count total for pagination
    const total = await prisma.work.count({ where });

    // Fetch works
    const works = await prisma.work.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        aiProvenance: true,
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy,
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return NextResponse.json({
      works,
      total,
      page,
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
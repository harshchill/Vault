import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import Paper from "@/models/paper";
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/rateLimit";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const parseLimit = (value) => {
  const limit = Number(value);
  if (!Number.isFinite(limit) || limit <= 0) return 20;
  return Math.min(Math.floor(limit), 50);
};

/**
 * GET /api/papers/search
 * Smart search for papers using MongoDB aggregation
 *
 * Query Parameters:
 * - q: Search query (searches subject, program, specialization) [required]
 * - limit: Number of results to return (default: 20, max: 50)
 * - status: only approved papers are searchable publicly
 *
 * Returns:
 * - Matching papers with metadata
 * - Ranked results based on relevance
 */
export async function GET(request) {
  try {
    const searchLimit = await checkRateLimit({
      policyName: "paperSearch",
      identifier: getClientIp(request),
    });

    if (!searchLimit.success) {
      return createRateLimitResponse(
        searchLimit,
        "Too many search requests. Please slow down and try again shortly."
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const limit = parseLimit(searchParams.get("limit"));
    const status = normalizeString(searchParams.get("status") || "approved").toLowerCase();

    if (status !== "approved") {
      return NextResponse.json(
        { error: "Only approved papers are searchable." },
        { status: 403 }
      );
    }

    if (!query || query.length < 2) {
      return NextResponse.json(
        {
          success: true,
          papers: [],
          message: "Query must be at least 2 characters long",
        },
        { status: 200 }
      );
    }

    const escapedQuery = escapeRegex(query);

    // MongoDB aggregation pipeline for smart search
    const papers = await Paper.aggregate([
      {
        $match: {
          status: "approved",
          $or: [
            { subject: { $regex: escapedQuery, $options: "i" } },
            { program: { $regex: escapedQuery, $options: "i" } },
            { specialization: { $regex: escapedQuery, $options: "i" } },
          ],
        },
      },
      {
        $addFields: {
          // Score results based on match type (subject > program > specialization)
          relevanceScore: {
            $add: [
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$subject",
                      regex: escapedQuery,
                      options: "i",
                    },
                  },
                  100,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$program",
                      regex: escapedQuery,
                      options: "i",
                    },
                  },
                  50,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$specialization",
                      regex: escapedQuery,
                      options: "i",
                    },
                  },
                  25,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: {
          relevanceScore: -1,
          uploadedAt: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          subject: 1,
          institute: 1,
          program: 1,
          specialization: 1,
          semester: 1,
          year: 1,
          uploadedAt: 1,
          relevanceScore: 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        papers,
        total: papers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json(
      { error: "Failed to search papers" },
      { status: 500 }
    );
  }
}

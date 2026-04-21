import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isValidObjectId } from "mongoose";
import connectDB from "@/db/connectDb";
import Paper from "@/models/paper";
import { User } from "@/models/user";

const VALID_STATUSES = new Set(["approved", "pending", "rejected"]);

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toPaperResponse = (paperInput) => {
  const paper =
    typeof paperInput?.toObject === "function"
      ? paperInput.toObject()
      : paperInput;

  const uploaderData =
    paper?.uploaderID && typeof paper.uploaderID === "object"
      ? paper.uploaderID
      : null;

  const uploaderObjectId = uploaderData?._id ?? paper?.uploaderID;

  return {
    id: String(paper._id),
    uploaderID: uploaderObjectId ? String(uploaderObjectId) : null,
    uploaderName: uploaderData?.name ?? null,
    uploaderEmail: uploaderData?.email ?? null,
    institute: paper.institute,
    subject: paper.subject,
    program: paper.program,
    specialization: paper.specialization,
    semester: paper.semester,
    year: paper.year,
    status: paper.status,
    isExtracted: paper.isExtracted,
    storageFileName: paper.storageFileName,
    storageURL: paper.storageURL,
    unlockCounts: paper.unlockCounts,
    saveCounts: paper.saveCounts,
    uploadedAt: paper.uploadedAt,
  };
};

/**
 * POST /api/papers
 * Creates a new exam paper entry in the database.
 *
 * Request body:
 * {
 *   subject: string (required),
 *   institute: string (required),
 *   semester: number (required, 1-8),
 *   year: number (required),
 *   specialization: string (required),
 *   program: string (required),
 *   storageURL: string (required) - URL to the PDF file,
 *   storageFileName: string (required)
 * }
 *
 * Returns:
 * - 201: Success with created paper data
 * - 400: Validation error
 * - 500: Server error
 */
export async function POST(request) {
  try {
    await connectDB();

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to upload papers." },
        { status: 401 }
      );
    }

    const uploader = await User.findOne({ email: token.email })
      .select("_id name email")
      .lean();

    if (!uploader) {
      return NextResponse.json(
        { error: "Uploader profile not found. Please sign in again." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      institute,
      subject,
      semester,
      year,
      specialization,
      program,
      storageURL,
      storageFileName,
    } = body;

    const instituteText = normalizeString(institute);
    const subjectText = normalizeString(subject);
    const specializationText = normalizeString(specialization);
    const programText = normalizeString(program);
    const storageUrlText = normalizeString(storageURL);
    const storageFileNameText = normalizeString(storageFileName);

    if (
      !instituteText ||
      !subjectText ||
      !semester ||
      !year ||
      !specializationText ||
      !programText ||
      !storageUrlText ||
      !storageFileNameText
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: institute, subject, semester, year, specialization, program, storageURL, storageFileName.",
        },
        { status: 400 }
      );
    }

    const semesterNum = Number(semester);
    if (!Number.isInteger(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return NextResponse.json(
        { error: "Semester must be a number between 1 and 8" },
        { status: 400 }
      );
    }

    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return NextResponse.json(
        { error: "Year must be a valid number between 2000 and 2100" },
        { status: 400 }
      );
    }

    const paper = await Paper.create({
      uploaderID: uploader._id,
      institute: instituteText,
      subject: subjectText,
      program: programText,
      specialization: specializationText,
      semester: semesterNum,
      year: yearNum,
      status: "pending",
      isExtracted: false,
      storageFileName: storageFileNameText,
      storageURL: storageUrlText,
      unlockCounts: 0,
      saveCounts: 0,
    });

    const createdPaper = {
      ...paper.toObject(),
      uploaderID: {
        _id: uploader._id,
        name: uploader.name,
        email: uploader.email,
      },
    };

    return NextResponse.json(
      {
        success: true,
        message: "Paper uploaded successfully and is pending admin approval.",
        paper: toPaperResponse(createdPaper),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating paper:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/papers
 * Retrieves exam papers with server-side filtering and pagination.
 *
 * Query parameters:
 * - semester: number - Filter by semester (1-8)
 * - year: number - Filter by year
 * - subject: string - Filter by subject code (case-insensitive contains)
 * - specialization: string - Filter by specialization (exact match)
 * - program: string - Filter by program (case-insensitive contains)
 * - id: string - Filter by specific paper id
 * - status: approved | pending | rejected (default: approved)
 * - limit: number - Page size (default 12, max 50)
 * - offset: number - Number of items to skip for pagination (default 0)
 *
 * Returns:
 * - 200: { success, papers: [...], count, total, limit, offset, hasMore, nextOffset, prevOffset }
 * - 500: Server error
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");
    const subject = searchParams.get("subject");
    const specialization = searchParams.get("specialization");
    const program = searchParams.get("program");
    const id = searchParams.get("id");
    const statusQuery =
      normalizeString(searchParams.get("status") || "approved").toLowerCase();
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    if (!VALID_STATUSES.has(statusQuery)) {
      return NextResponse.json(
        { error: "Invalid status. Use approved, pending, or rejected." },
        { status: 400 }
      );
    }

    if (statusQuery !== "approved") {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token || token.role !== "admin") {
        return NextResponse.json(
          {
            error:
              "Admin privileges required to access pending or rejected papers.",
          },
          { status: 403 }
        );
      }
    }

    const filter = { status: statusQuery };

    if (semester) {
      const semesterNum = Number(semester);
      if (Number.isInteger(semesterNum)) {
        filter.semester = semesterNum;
      }
    }

    if (year) {
      const yearNum = Number(year);
      if (Number.isInteger(yearNum)) {
        filter.year = yearNum;
      }
    }

    if (subject) {
      const subjectText = normalizeString(subject);
      if (subjectText) {
        filter.subject = { $regex: escapeRegex(subjectText), $options: "i" };
      }
    }

    if (specialization) {
      const specializationText = normalizeString(specialization);
      if (specializationText) {
        filter.specialization = specializationText;
      }
    }

    if (program) {
      const programText = normalizeString(program);
      if (programText) {
        filter.program = { $regex: escapeRegex(programText), $options: "i" };
      }
    }

    if (id) {
      const idText = normalizeString(id);
      if (!isValidObjectId(idText)) {
        return NextResponse.json(
          { error: "Invalid paper id." },
          { status: 400 }
        );
      }
      filter._id = idText;
    }

    let limit = Number(limitParam ?? 12);
    let offset = Number(offsetParam ?? 0);
    if (isNaN(limit) || limit <= 0) limit = 12;
    if (limit > 50) limit = 50;
    if (isNaN(offset) || offset < 0) offset = 0;

    const total = await Paper.countDocuments(filter);

    const papers = await Paper.find(filter)
      .sort({ uploadedAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("uploaderID", "name email")
      .lean();

    const hasMore = offset + papers.length < total;
    const nextOffset = hasMore ? offset + papers.length : null;
    const prevOffset = offset > 0 ? Math.max(0, offset - limit) : null;

    return NextResponse.json(
      {
        success: true,
        count: papers.length,
        total,
        limit,
        offset,
        hasMore,
        nextOffset,
        prevOffset,
        papers: papers.map(toPaperResponse),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/papers
 * Updates a paper status (admin only).
 *
 * Request body:
 * {
 *   paperId: string (required) - ID of the paper to update
 *   status: "approved" | "pending" | "rejected" (required)
 * }
 *
 * Returns:
 * - 200: Success with updated paper data
 * - 400: Validation error
 * - 401: Unauthorized (not admin)
 * - 404: Paper not found
 * - 500: Server error
 */
export async function PATCH(request) {
  try {
    await connectDB();

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.email) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (token.role !== "admin") {
      return NextResponse.json(
        { error: "Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { paperId, status } = body;

    if (!isValidObjectId(paperId)) {
      return NextResponse.json({ error: "Invalid paperId." }, { status: 400 });
    }

    const nextStatus = normalizeString(status).toLowerCase();

    if (!paperId || !VALID_STATUSES.has(nextStatus)) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid fields: paperId and status (approved, pending, rejected).",
        },
        { status: 400 }
      );
    }

    const paper = await Paper.findByIdAndUpdate(
      paperId,
      { status: nextStatus },
      { new: true }
    );

    if (!paper) {
      return NextResponse.json({ error: "Paper not found." }, { status: 404 });
    }

    await paper.populate("uploaderID", "name email");

    return NextResponse.json(
      {
        success: true,
        message: `Paper status updated to ${nextStatus}.`,
        paper: toPaperResponse(paper),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating paper:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

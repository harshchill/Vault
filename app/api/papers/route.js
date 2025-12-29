import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/db/connectDb";
import Paper from "@/models/paper";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/papers
 * Creates a new exam paper entry in the database
 *
 * Request body:
 * {
 *   title: string (required),
 *   subject: string (required),
 *   semester: number (required, 1-8),
 *   year: number (required),
 *   specialization: string (required), // previously named `department`
 *   program: string (required),
 *   url: string (required) - URL to the PDF file
 * }
 *
 * Returns:
 * - 201: Success with created paper data
 * - 400: Validation error
 * - 500: Server error
 */
export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Get token to get user email
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

    // Parse request body
    const body = await request.json();
    const {
      title,
      subject,
      semester,
      year,
      specialization,
      department,
      program,
      url,
      fileName,
    } = body;

    // Validate required fields
    const effectiveSpecialization = (specialization ?? department)
      ?.toString()
      .trim();
    if (
      !title ||
      !subject ||
      !semester ||
      !year ||
      !effectiveSpecialization ||
      !program ||
      !url ||
      !fileName
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, subject, semester, year, specialization, program, url , FileName ",
        },
        { status: 400 }
      );
    }

    // Basic specialization validation (non-empty string)
    if (
      typeof effectiveSpecialization !== "string" ||
      effectiveSpecialization.length === 0
    ) {
      return NextResponse.json(
        { error: "Specialization must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate semester is a number between 1-8
    const semesterNum = Number(semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return NextResponse.json(
        { error: "Semester must be a number between 1 and 8" },
        { status: 400 }
      );
    }

    // Validate year is a reasonable number
    const yearNum = Number(year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return NextResponse.json(
        { error: "Year must be a valid number between 2000 and 2100" },
        { status: 400 }
      );
    }

    // Create new paper document
    const paper = await Paper.create({
      title: title.trim(),
      subject: subject.trim(),
      semester: semesterNum,
      year: yearNum,
      // Backward-compat: store under existing schema field `department`
      department: effectiveSpecialization,
      program: program.trim(),
      url: url.trim(),
      fileName: fileName,
      uploadedBy: token.email, // Email of the user who uploaded
      adminApproved: false, // Default to false, admin needs to approve
    });

    return NextResponse.json(
      {
        success: true,
        message: "Paper created successfully",
        paper: {
          id: paper._id,
          title: paper.title,
          subject: paper.subject,
          semester: paper.semester,
          year: paper.year,
          // Expose both during transition
          specialization: paper.department,
          department: paper.department,
          program: paper.program,
          url: paper.url,
          uploadedBy: paper.uploadedBy,
          adminApproved: paper.adminApproved,
          createdAt: paper.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating paper:", error);

    // Handle duplicate key errors or validation errors
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
 * Query parameters (optional):
 * - semester: number - Filter by semester (1-8)
 * - year: number - Filter by year
 * - subject: string - Filter by subject code (case-insensitive contains)
 * - specialization: string - Filter by specialization (mapped to DB field `department`)
 * - department: string - Deprecated; still supported for backward compatibility
 * - program: string - Filter by program (case-insensitive contains)
 * - id: string - Filter by specific paper id
 * - unapproved: "true" | "false" - When true, returns unapproved items (admin use)
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");
    const subject = searchParams.get("subject");
    const specialization = searchParams.get("specialization");
    const department = searchParams.get("department");
    const program = searchParams.get("program");
    const id = searchParams.get("id");
    const unapproved = searchParams.get("unapproved"); // For admin to get unapproved papers
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    // Build filter object
    // If unapproved=true, show unapproved papers (for admin), otherwise show only approved
    const filter =
      unapproved === "true"
        ? { adminApproved: false }
        : { adminApproved: true };
    if (semester) {
      const semesterNum = Number(semester);
      if (!isNaN(semesterNum)) filter.semester = semesterNum;
    }
    if (year) {
      const yearNum = Number(year);
      if (!isNaN(yearNum)) filter.year = yearNum;
    }
    if (subject) {
      filter.subject = { $regex: subject, $options: "i" }; // Case-insensitive search
    }
    // Map `specialization` (or deprecated `department`) to DB field `department`
    const specValue = specialization ?? department;
    if (specValue) filter.department = specValue;
    if (program) {
      filter.program = { $regex: program, $options: "i" }; // Case-insensitive search
    }
    // If a specific id is provided, filter by _id
    if (id) {
      try {
        filter._id = id;
      } catch {}
    }

    // Pagination controls
    let limit = Number(limitParam ?? 12);
    let offset = Number(offsetParam ?? 0);
    if (isNaN(limit) || limit <= 0) limit = 12;
    if (limit > 50) limit = 50; // hard cap to protect the DB
    if (isNaN(offset) || offset < 0) offset = 0;

    // Total count for the current filter (before pagination)
    const total = await Paper.countDocuments(filter);

    // Fetch paginated papers from database (only approved ones unless unapproved=true)
    const papers = await Paper.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(offset)
      .limit(limit)
      .select(
        "title subject semester year department program url uploadedBy adminApproved createdAt"
      );

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
        papers: papers.map((paper) => ({
          id: paper._id,
          title: paper.title,
          subject: paper.subject,
          semester: paper.semester,
          year: paper.year,
          specialization: paper.department,
          department: paper.department,
          program: paper.program,
          url: paper.url,
          uploadedBy: paper.uploadedBy,
          adminApproved: paper.adminApproved,
          createdAt: paper.createdAt,
        })),
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
 * Updates a paper's approval status (admin only)
 *
 * Request body:
 * {
 *   paperId: string (required) - ID of the paper to update
 *   adminApproved: boolean (required) - New approval status
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
    // Connect to database
    await connectDB();

    // Get token to verify admin role
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

    // Check if user is admin
    if (token.role !== "admin") {
      return NextResponse.json(
        { error: "Admin privileges required." },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { paperId, adminApproved } = body;

    // Validate required fields
    if (!paperId || typeof adminApproved !== "boolean") {
      return NextResponse.json(
        {
          error: "Missing required fields: paperId and adminApproved (boolean)",
        },
        { status: 400 }
      );
    }

    // Find and update the paper
    const paper = await Paper.findByIdAndUpdate(
      paperId,
      { adminApproved: adminApproved },
      { new: true } // Return updated document
    );

    if (adminApproved === false) {
      // 1. Fetch the document first using the Model (Capital 'P')
      const existingPaper = await Paper.findById(paperId);

      // Safety check: ensure the paper actually exists before trying to delete
      if (!existingPaper) {
        throw new Error("Paper not found in database");
      }

      const filename = existingPaper.fileName;

      // 2. Initialize Supabase Admin Client
      // ⚠️ CRITICAL: Use SERVICE_ROLE_KEY for deletion permissions
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABSE_SERVICE_ROLE_KEY
      );

      // 3. Delete from Supabase Storage
      const { data: deleteData, error: deleteError } =
        await supabaseAdmin.storage.from("Vault").remove([filename]);

      if (deleteError) {
        console.error("Supabase Deletion Error:", deleteError.message);
        // Optional: decided if you want to stop here or continue to delete from MongoDB
      }

      // 4. Delete from MongoDB
      await Paper.findByIdAndDelete(paperId);
    }

    if (!paper) {
      return NextResponse.json({ error: "Paper not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Paper ${
          adminApproved ? "approved" : "rejected"
        } successfully`,
        paper: {
          id: paper._id,
          title: paper.title,
          subject: paper.subject,
          semester: paper.semester,
          year: paper.year,
          specialization: paper.department,
          department: paper.department,
          program: paper.program,
          url: paper.url,
          uploadedBy: paper.uploadedBy,
          adminApproved: paper.adminApproved,
          createdAt: paper.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating paper:", error);

    // Handle validation errors
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

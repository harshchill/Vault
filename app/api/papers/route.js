import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDb';
import Paper from '@/models/paper';

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
 *   department: string (required, CS|mining|cement|others),
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

    // Parse request body
    const body = await request.json();
    const { title, subject, semester, year, department, program, url } = body;

    // Validate required fields
    if (!title || !subject || !semester || !year || !department || !program || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subject, semester, year, department, program, url' },
        { status: 400 }
      );
    }
    
    // Validate department
    const validDepartments = ['CS', 'mining', 'cement', 'others'];
    if (!validDepartments.includes(department)) {
      return NextResponse.json(
        { error: `Department must be one of: ${validDepartments.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate semester is a number between 1-8
    const semesterNum = Number(semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
      return NextResponse.json(
        { error: 'Semester must be a number between 1 and 8' },
        { status: 400 }
      );
    }

    // Validate year is a reasonable number
    const yearNum = Number(year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return NextResponse.json(
        { error: 'Year must be a valid number between 2000 and 2100' },
        { status: 400 }
      );
    }

    // Create new paper document
    const paper = await Paper.create({
      title: title.trim(),
      subject: subject.trim(),
      semester: semesterNum,
      year: yearNum,
      department: department,
      program: program.trim(),
      url: url.trim(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Paper created successfully',
        paper: {
          id: paper._id,
          title: paper.title,
          subject: paper.subject,
          semester: paper.semester,
          year: paper.year,
          department: paper.department,
          program: paper.program,
          url: paper.url,
          createdAt: paper.createdAt,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating paper:', error);
    
    // Handle duplicate key errors or validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/papers
 * Retrieves all exam papers from the database
 * 
 * Query parameters (optional):
 * - semester: number - Filter by semester (1-8)
 * - year: number - Filter by year
 * - subject: string - Filter by subject code
 * - department: string - Filter by department (CS|mining|cement|others)
 * - program: string - Filter by program
 * 
 * Returns:
 * - 200: Success with array of papers
 * - 500: Server error
 */
export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');
    const year = searchParams.get('year');
    const subject = searchParams.get('subject');
    const department = searchParams.get('department');
    const program = searchParams.get('program');

    // Build filter object
    const filter = {};
    if (semester) {
      const semesterNum = Number(semester);
      if (!isNaN(semesterNum)) filter.semester = semesterNum;
    }
    if (year) {
      const yearNum = Number(year);
      if (!isNaN(yearNum)) filter.year = yearNum;
    }
    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' }; // Case-insensitive search
    }
    if (department) {
      filter.department = department;
    }
    if (program) {
      filter.program = { $regex: program, $options: 'i' }; // Case-insensitive search
    }

    // Fetch papers from database
    const papers = await Paper.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .select('title subject semester year department program url createdAt');

    return NextResponse.json(
      { 
        success: true,
        count: papers.length,
        papers: papers.map(paper => ({
          id: paper._id,
          title: paper.title,
          subject: paper.subject,
          semester: paper.semester,
          year: paper.year,
          department: paper.department,
          program: paper.program,
          url: paper.url,
          createdAt: paper.createdAt,
        }))
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}


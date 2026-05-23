"use server";

import connectDB from "@/db/connectDb";
import { User } from "@/models/user";
import Paper from "@/models/paper";
import Request from "@/models/request";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteSupabaseFile } from "@/lib/supabaseAdmin";

/**
 * Validates if the current user is an admin.
 */
async function requireAdmin() {
  const session = await getServerSession(authoptions);
  if (!session || !session.user || session.user.role !== "admin") {
    throw new Error("Unauthorized. Admin privileges required.");
  }
}

// Helper to safely serialize MongoDB documents for Client Components
const serializeDoc = (doc) => JSON.parse(JSON.stringify(doc));

/**
 * GET Admin Stats
 */
export async function getAdminStats() {
  await requireAdmin();
  await connectDB();

  const totalUsers = await User.countDocuments();
  const totalPapers = await Paper.countDocuments({ status: "approved" });
  const pendingPapersCount = await Paper.countDocuments({ status: "pending" });
  const totalUploads = await Paper.countDocuments();
  const totalRequests = await Request.countDocuments();

  const topUniversitiesResult = await Paper.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$institute", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const topUniversities = topUniversitiesResult.map(item => ({
    name: item._id,
    count: item.count,
  }));

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const trendsResult = await Paper.aggregate([
    { $match: { uploadedAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          month: { $month: "$uploadedAt" },
          year: { $year: "$uploadedAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const uploadTrends = trendsResult.map(item => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year.toString().slice(2)}`,
    count: item.count,
  }));

  const userTrendsResult = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const userTrends = userTrendsResult.map(item => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year.toString().slice(2)}`,
    count: item.count,
  }));

  const mostSavedPaper = await Paper.findOne({ status: "approved", saveCounts: { $gt: 0 } })
    .sort({ saveCounts: -1 })
    .select("subject program specialization semester year saveCounts")
    .lean();

  const branchUploadsResult = await Paper.aggregate([
    { $match: { status: "approved", specialization: { $ne: null } } },
    { $group: { _id: "$specialization", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  const branchUploads = branchUploadsResult.map(item => ({
    name: item._id,
    count: item.count,
  }));

  const recentPending = await Paper.find({ status: "pending" })
    .sort({ uploadedAt: -1 })
    .limit(5)
    .populate("uploaderID", "name email")
    .lean();

  return serializeDoc({
    totalUsers,
    totalPapers,
    pendingPapersCount,
    totalUploads,
    totalRequests,
    topUniversities,
    uploadTrends,
    userTrends,
    mostSavedPaper,
    branchUploads,
    recentPending,
  });
}

/**
 * GET All Users with Pagination
 */
export async function getAllUsers(search = "", page = 1, limit = 10) {
  await requireAdmin();
  await connectDB();

  let query = {};
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } }
      ],
    };
  }

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  
  return serializeDoc({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
}

/**
 * UPDATE User
 */
export async function updateUser(userId, data) {
  await requireAdmin();
  await connectDB();

  const { name, role, university, program, specialization, semester } = data;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, role, university, program, specialization, semester },
    { new: true }
  ).lean();

  if (!updatedUser) throw new Error("User not found");

  return serializeDoc(updatedUser);
}

/**
 * DELETE User
 */
export async function deleteUser(userId) {
  await requireAdmin();
  await connectDB();

  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) throw new Error("User not found");
  
  return { success: true };
}

/**
 * GET All Papers with Pagination
 */
export async function getAllPapers(search = "", page = 1, limit = 10) {
  await requireAdmin();
  await connectDB();

  let query = { status: { $ne: "pending" } };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { institute: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (page - 1) * limit;
  const total = await Paper.countDocuments(query);
  const papers = await Paper.find(query)
    .populate("uploaderID", "name email")
    .sort({ uploadedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return serializeDoc({
    papers,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
}

/**
 * UPDATE Paper
 */
export async function updatePaper(paperId, data) {
  await requireAdmin();
  await connectDB();

  const { subject, institute, program, specialization, semester, year } = data;

  const updatedPaper = await Paper.findByIdAndUpdate(
    paperId,
    { subject, institute, program, specialization, semester, year },
    { new: true }
  ).populate("uploaderID", "name email").lean();

  if (!updatedPaper) throw new Error("Paper not found");

  return serializeDoc(updatedPaper);
}

/**
 * DELETE Paper
 */
export async function deletePaper(paperId) {
  await requireAdmin();
  await connectDB();

  const paper = await Paper.findById(paperId).lean();
  if (!paper) throw new Error("Paper not found");

  if (paper.storageFileName) {
    const fileDelete = await deleteSupabaseFile(paper.storageFileName);
    if (!fileDelete.success) {
      throw new Error(fileDelete.error || "Failed to delete paper file.");
    }
  }

  await Paper.findByIdAndDelete(paperId);

  return { success: true };
}

/**
 * GET Pending Papers
 */
export async function getPendingPapers() {
  await requireAdmin();
  await connectDB();

  const papers = await Paper.find({ status: "pending" })
    .populate("uploaderID", "name email")
    .sort({ uploadedAt: -1 })
    .lean();

  return serializeDoc(papers);
}

/**
 * GET Approved Papers (lightweight)
 */
export async function getApprovedPapersForMatching() {
  await requireAdmin();
  await connectDB();

  const papers = await Paper.find({ status: "approved" })
    .select(
      "subject title institute program specialization semester year storageURL uploadedAt"
    )
    .sort({ uploadedAt: -1 })
    .lean();

  return serializeDoc(papers);
}

/**
 * GET Open Requests
 */
export async function getOpenRequests() {
  await requireAdmin();
  await connectDB();

  const requests = await Request.find({ status: "open" })
    .populate("requesterId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return serializeDoc(requests);
}

/**
 * GET All Requests for Matching
 */
export async function getRequestsForMatching() {
  await requireAdmin();
  await connectDB();

  const requests = await Request.find({})
    .select(
      "subject institute program specialization semester year status requesterEmail requesterId createdAt"
    )
    .sort({ createdAt: -1 })
    .lean();

  return serializeDoc(requests);
}

/**
 * UPDATE Request Status
 */
export async function updateRequestStatus(requestId, status) {
  await requireAdmin();
  await connectDB();

  const allowedStatuses = new Set(["open", "fulfilled", "rejected"]);
  if (!allowedStatuses.has(status)) {
    throw new Error("Invalid request status");
  }

  const updated = await Request.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  )
    .populate("requesterId", "name email")
    .lean();

  if (!updated) throw new Error("Request not found");

  return serializeDoc(updated);
}

/**
 * DELETE Request
 */
export async function deleteRequest(requestId) {
  await requireAdmin();
  await connectDB();

  const deleted = await Request.findByIdAndDelete(requestId);
  if (!deleted) throw new Error("Request not found");

  return { success: true };
}

/**
 * APPROVE / REJECT Paper
 */
export async function approveRejectPaper(paperId, status) {
  await requireAdmin();
  await connectDB();

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const paper = await Paper.findById(paperId).lean();
  if (!paper) throw new Error("Paper not found");

  const update = { status };

  if (status === "rejected") {
    if (paper.storageFileName && !paper.isFileDeleted) {
      const fileDelete = await deleteSupabaseFile(paper.storageFileName);
      if (!fileDelete.success) {
        throw new Error(fileDelete.error || "Failed to delete paper file.");
      }
      update.isFileDeleted = true;
      update.fileDeletedAt = new Date();
    } else if (paper.isFileDeleted && !paper.fileDeletedAt) {
      update.fileDeletedAt = new Date();
    }
  }

  const updatedPaper = await Paper.findByIdAndUpdate(paperId, update, {
    new: true,
  }).lean();

  if (!updatedPaper) throw new Error("Paper not found");

  return serializeDoc(updatedPaper);
}

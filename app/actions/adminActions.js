"use server";

import connectDB from "@/db/connectDb";
import { User } from "@/models/user";
import Paper from "@/models/paper";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";

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
    topUniversities,
    uploadTrends,
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

  const deleted = await Paper.findByIdAndDelete(paperId);
  if (!deleted) throw new Error("Paper not found");

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
 * APPROVE / REJECT Paper
 */
export async function approveRejectPaper(paperId, status) {
  await requireAdmin();
  await connectDB();

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const updatedPaper = await Paper.findByIdAndUpdate(
    paperId,
    { status },
    { new: true }
  ).lean();

  if (!updatedPaper) throw new Error("Paper not found");

  return serializeDoc(updatedPaper);
}

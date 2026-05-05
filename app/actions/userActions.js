"use server";

import connectDB from "@/db/connectDb";
import { User } from "@/models/user";
import Paper from "@/models/paper";
import SavedPaper from "@/models/savedPaper";
import { getServerSession } from "next-auth/next";
import { isValidObjectId } from "mongoose";

const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

async function resolveActingEmail(email) {
  const session = await getServerSession();
  const sessionEmail = normalizeEmail(session?.user?.email);
  const providedEmail = normalizeEmail(email);

  if (sessionEmail && providedEmail && sessionEmail !== providedEmail) {
    return { success: false, error: "Unauthorized request" };
  }

  const actingEmail = sessionEmail || providedEmail;
  if (!actingEmail) {
    return { success: false, error: "Authentication required" };
  }

  return { success: true, email: actingEmail };
}

export async function getUserDashboardStats(email) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).lean();
    if (!user) return { success: false, error: "User not found" };

    const isProfileComplete = Boolean(
      user.university?.trim() &&
        user.program?.trim() &&
        user.specialization?.trim() &&
        user.semester
    );

    const totalUploaded = await Paper.countDocuments({ uploaderID: user._id });
    const totalSaved = await SavedPaper.countDocuments({ userId: user._id });

    // Latest 5 papers uploaded by anyone
    const recentPapers = await Paper.find({ status: "approved" })
      .sort({ uploadedAt: -1 })
      .limit(5)
      .lean();

    const leaderboardAgg = await Paper.aggregate([
      { $match: { status: "approved", uploaderID: { $ne: null } } },
      { $group: { _id: "$uploaderID", uploadCount: { $sum: 1 } } },
      { $sort: { uploadCount: -1 } },
    ]);

    const leaderboardUserIds = leaderboardAgg.map((entry) => entry._id).filter(Boolean);
    const leaderboardUsers = await User.find({ _id: { $in: leaderboardUserIds } })
      .select("name specialization semester")
      .lean();
    const leaderboardUserMap = new Map(
      leaderboardUsers.map((u) => [String(u._id), u])
    );

    const leaderboard = leaderboardAgg.map((entry, index) => {
      const userId = String(entry._id);
      const userInfo = leaderboardUserMap.get(userId) || {};
      return {
        rank: index + 1,
        userId,
        name: userInfo.name || "Unknown",
        branch: userInfo.specialization || "Unknown",
        semester: userInfo.semester || null,
        uploadCount: entry.uploadCount,
        isCurrentUser: String(user._id) === userId,
      };
    });

    return {
      success: true,
      stats: { totalUploaded, totalSaved },
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        image: user.image,
        university: user.university || "",
        program: user.program || "",
        specialization: user.specialization || "",
        semester: user.semester || "",
        isProfileComplete,
      },
      recentPapers: recentPapers.map(p => ({
        id: p._id.toString(),
        subject: p.subject,
        semester: p.semester,
        program: p.program,
        year: p.year,
      })),
      leaderboard,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function getUserProfile(email) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).lean();
    if (!user) return { success: false, error: "User not found" };

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        university: user.university || "",
        program: user.program || "",
        specialization: user.specialization || "",
        semester: user.semester || "",
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function updateUserProfile(email, formData) {
  try {
    await connectDB();
    
    const updateData = {
      university: formData.get("university"),
      program: formData.get("program"),
      specialization: formData.get("specialization"),
    };
    
    // Add image URL if provided
    const imgUrl = formData.get("image");
    if (imgUrl) {
      updateData.image = imgUrl;
    }

    // Only update semester if it's a valid number
    const sem = formData.get("semester");
    if (sem && !isNaN(sem)) {
      updateData.semester = Number(sem);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedUser) return { success: false, error: "User not found" };

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function savePaperForUser(email, paperId) {
  try {
    if (!isValidObjectId(paperId)) {
      return { success: false, error: "Invalid paper id" };
    }

    const resolved = await resolveActingEmail(email);
    if (!resolved.success) return resolved;

    await connectDB();

    const user = await User.findOne({ email: resolved.email }).select("_id").lean();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const paper = await Paper.findOne({ _id: paperId, status: "approved" })
      .select("_id")
      .lean();
    if (!paper) {
      return { success: false, error: "Paper not found" };
    }

    const existing = await SavedPaper.findOne({
      userId: user._id,
      paperId: paper._id,
    })
      .select("_id")
      .lean();

    if (existing) {
      return {
        success: true,
        saved: true,
        alreadySaved: true,
        message: "Paper already saved",
      };
    }

    await SavedPaper.create({ userId: user._id, paperId: paper._id });
    await Paper.updateOne({ _id: paper._id }, { $inc: { saveCounts: 1 } });

    return {
      success: true,
      saved: true,
      alreadySaved: false,
      message: "Paper saved",
    };
  } catch (error) {
    if (error?.code === 11000) {
      return {
        success: true,
        saved: true,
        alreadySaved: true,
        message: "Paper already saved",
      };
    }

    console.error("Error saving paper:", error);
    return { success: false, error: "Failed to save paper" };
  }
}

export async function unsavePaperForUser(email, paperId) {
  try {
    if (!isValidObjectId(paperId)) {
      return { success: false, error: "Invalid paper id" };
    }

    const resolved = await resolveActingEmail(email);
    if (!resolved.success) return resolved;

    await connectDB();

    const user = await User.findOne({ email: resolved.email }).select("_id").lean();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const deletion = await SavedPaper.deleteOne({ userId: user._id, paperId });

    if (deletion.deletedCount > 0) {
      await Paper.updateOne(
        { _id: paperId, saveCounts: { $gt: 0 } },
        { $inc: { saveCounts: -1 } }
      );
    }

    return {
      success: true,
      saved: false,
      removed: deletion.deletedCount > 0,
      message:
        deletion.deletedCount > 0
          ? "Paper removed from saved"
          : "Paper was not saved",
    };
  } catch (error) {
    console.error("Error removing saved paper:", error);
    return { success: false, error: "Failed to remove saved paper" };
  }
}

export async function getSavedPaperIds(email) {
  try {
    const resolved = await resolveActingEmail(email);
    if (!resolved.success) return resolved;

    await connectDB();

    const user = await User.findOne({ email: resolved.email }).select("_id").lean();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const savedEntries = await SavedPaper.find({ userId: user._id })
      .select("paperId")
      .lean();

    return {
      success: true,
      savedPaperIds: savedEntries.map((entry) => entry.paperId.toString()),
    };
  } catch (error) {
    console.error("Error fetching saved paper ids:", error);
    return { success: false, error: "Failed to fetch saved papers" };
  }
}

export async function getSavedPapers(email) {
  try {
    const resolved = await resolveActingEmail(email);
    if (!resolved.success) return resolved;

    await connectDB();

    const user = await User.findOne({ email: resolved.email }).select("_id").lean();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const savedEntries = await SavedPaper.find({ userId: user._id })
      .sort({ savedAt: -1 })
      .populate({
        path: "paperId",
        match: { status: "approved" },
      })
      .lean();

    const papers = savedEntries
      .filter((entry) => entry.paperId)
      .map((entry) => ({
        id: entry.paperId._id.toString(),
        subject: entry.paperId.subject,
        semester: entry.paperId.semester,
        program: entry.paperId.program,
        specialization: entry.paperId.specialization,
        institute: entry.paperId.institute,
        year: entry.paperId.year,
        storageURL: entry.paperId.storageURL,
        uploadedAt: entry.paperId.uploadedAt,
        savedAt: entry.savedAt,
      }));

    return {
      success: true,
      count: papers.length,
      papers,
    };
  } catch (error) {
    console.error("Error fetching saved papers:", error);
    return { success: false, error: "Failed to fetch saved papers" };
  }
}

export async function getPaperPdfUrl(paperId) {
  try {
    if (!isValidObjectId(paperId)) {
      return { success: false, error: "Invalid paper id" };
    }

    const session = await getServerSession();
    if (!session?.user?.email) {
      return { success: false, error: "Authentication required" };
    }

    await connectDB();

    const paper = await Paper.findOne({ _id: paperId, status: "approved" })
      .select("storageURL")
      .lean();

    if (!paper?.storageURL) {
      return { success: false, error: "Paper PDF not available" };
    }

    return { success: true, url: paper.storageURL };
  } catch (error) {
    console.error("Error fetching paper PDF URL:", error);
    return { success: false, error: "Failed to fetch paper PDF" };
  }
}

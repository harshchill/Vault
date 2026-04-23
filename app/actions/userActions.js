"use server";

import connectDB from "@/db/connectDb";
import { User } from "@/models/user";
import Paper from "@/models/paper";
import SavedPaper from "@/models/savedPaper";

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

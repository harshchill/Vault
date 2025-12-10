import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDb';
import Paper from '@/models/paper';
import { User } from '@/models/user';

export async function GET() {
  try {
    await connectDB();

    // Aggregate approved papers by uploader email
    const agg = await Paper.aggregate([
      { $match: { adminApproved: true } },
      { $group: { _id: '$uploadedBy', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    // Fetch user info (name/image) for each uploader
    const emails = agg.map(a => a._id).filter(Boolean);

    const users = await User.find({ email: { $in: emails } })
      .select('email name image')
      .lean();

    const userMap = new Map(users.map(u => [u.email, u]));

    const ranked = agg.map((a, idx) => {
      const u = userMap.get(a._id);
      const name = u?.name || a._id?.split('@')[0] || 'User';
      const firstName = name.split(' ')[0];
      return {
        rank: idx + 1,
        email: a._id,
        count: a.count,
        name,
        firstName,
        image: u?.image || null,
      };
    });

    return NextResponse.json({ success: true, contributors: ranked }, { status: 200 });
  } catch (error) {
    console.error('Error aggregating contributions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load contributions. Please try again later.' },
      { status: 500 }
    );
  }
}

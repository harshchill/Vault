import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDb';
import Paper from '@/models/paper';
import { User } from '@/models/user';

export async function GET() {
  try {
    await connectDB();

    // Aggregate approved papers by uploader id.
    const agg = await Paper.aggregate([
      { $match: { status: 'approved', uploaderID: { $ne: null } } },
      { $group: { _id: '$uploaderID', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    const userIds = agg.map((a) => a._id).filter(Boolean);

    const users = await User.find({ _id: { $in: userIds } })
      .select('_id name image')
      .lean();

    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const ranked = agg.map((a, idx) => {
      const userId = String(a._id);
      const u = userMap.get(userId);
      const name = u?.name || 'User';
      const firstName = name.split(' ')[0];
      return {
        rank: idx + 1,
        id: userId,
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

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(req: Request) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    const body = await req.json();

    const campaign = await prisma.campaign.update({
      where: { id: String(id) },
      data: body,
    });

    // Return the updated campaign data
    return NextResponse.json(campaign, { status: 200 });
  } catch (error) {
    console.error('Failed to update campaign:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const id = url.searchParams.get('id');

//     if (!id) {
//       return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
//     }

//     const campaign = await prisma.campaign.findUnique({
//       where: { id: String(id) },
//       include: {
//         posts: {
//           include: {
//             dailyStats: {
//               orderBy: { date: 'asc' }
//             }
//           },
//           orderBy: { timePosted: 'desc' }
//         }
//       }
//     });

//     if (!campaign) {
//       return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
//     }

//     // Aggregate daily stats across all posts
//     const dailyStats = campaign.posts.reduce((acc, post) => {
//       post.dailyStats.forEach(stat => {
//         const dateStr = format(stat.date, 'yyyy-MM-dd');
//         if (!acc[dateStr]) {
//           acc[dateStr] = {
//             date: stat.date,
//             engagements: 0,
//             parentEngagements: 0,
//             newPosts: 0
//           };
//         }
//         acc[dateStr].engagements += stat.engagements;
//         acc[dateStr].parentEngagements += stat.parentEngagements;
//         acc[dateStr].newPosts += stat.newPosts;
//       });
//       return acc;
//     }, {} as Record<string, any>);

//     // Convert to array and sort by date
//     const dailyStatsArray = Object.values(dailyStats).sort(
//       (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//     );

//     // Calculate aggregate stats
//     const stats = campaign.posts.reduce((acc, post) => ({
//       totalLikes: acc.totalLikes + post.totalLikes,
//       totalReplies: acc.totalReplies + post.totalReplies,
//       totalUpvotes: acc.totalUpvotes + post.upvotes,
//       positive: acc.positive + post.positive,
//       negative: acc.negative + post.negative,
//       neutral: acc.neutral + post.neutral,
//     }), { 
//       totalLikes: 0, 
//       totalReplies: 0, 
//       totalUpvotes: 0,
//       positive: 0,
//       negative: 0,
//       neutral: 0
//     });

//     return NextResponse.json({
//       ...campaign,
//       stats,
//       dailyStats: dailyStatsArray,
//       postCount: campaign.posts.length,
//     }, { status: 200 });
//   } catch (error) {
//     console.error('Failed to fetch campaign:', error);
//     return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
//   }
// }


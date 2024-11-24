import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  console.log("TEST!")
  if (req.method !== 'GET') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const userId = req.url.split('/').pop();

    const campaigns = await prisma.campaign.findMany({
      where: { userId: String(userId) },
      include: { posts: true },
    });

    // Calculate overall stats
    const stats = campaigns.reduce(
      (acc, campaign) => {
        const campaignStats = campaign.posts.reduce(
          (postAcc, post) => ({
            totalLikes: postAcc.totalLikes + post.totalLikes,
            totalReplies: postAcc.totalReplies + post.totalReplies,
            totalUpvotes: postAcc.totalUpvotes + post.upvotes,
            positive: postAcc.positive + post.positive,
            negative: postAcc.negative + post.negative,
            neutral: postAcc.neutral + post.neutral,
          }),
          acc
        );

        return campaignStats;
      },
      {
        totalLikes: 0,
        totalReplies: 0,
        totalUpvotes: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
      }
    );

    // Get engagement data for chart
    const posts = campaigns.flatMap((c) => c.posts);
    const engagementData = posts
      .sort((a, b) => new Date(a.timePosted).getTime() - new Date(b.timePosted).getTime())
      .slice(-7) // Last 7 posts
      .map((post) => ({
        date: post.timePosted,
        value: post.totalLikes + post.totalReplies,
      }));

    // Get recent activity
    const recentPosts = posts
      .sort((a, b) => new Date(b.timePosted).getTime() - new Date(a.timePosted).getTime())
      .slice(0, 4)
      .map((post) => ({
        id: post.id,
        subreddit: post.subreddit,
        upvotes: post.upvotes,
        timePosted: post.timePosted,
        postUrl: post.postUrl,
      }));

    return NextResponse.json({
      stats,
      engagementData,
      recentPosts,
      activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
      totalCampaigns: campaigns.length,
      totalPosts: posts.length,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
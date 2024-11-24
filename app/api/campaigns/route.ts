import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const campaigns = await prisma.campaign.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        posts: {
          include: {
            dailyStats: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return NextResponse.json(campaigns, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve campaigns:', error);
    return NextResponse.json({ error: 'Failed to retrieve campaigns' }, { status: 500 });
  }
}
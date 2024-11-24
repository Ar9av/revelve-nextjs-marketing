import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
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

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve campaign details:', error);
    return NextResponse.json({ error: 'Failed to retrieve campaign details' }, { status: 500 });
  }
}
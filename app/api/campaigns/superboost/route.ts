import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id } = req.url.split('/').pop();
    const { superboostParams } = await req.json();

    const campaign = await prisma.campaign.findUnique({
      where: { id: String(id) }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.superboost) {
      return NextResponse.json({ error: 'Campaign is already boosted' }, { status: 400 });
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id: String(id) },
      data: {
        superboost: true,
        superboostParams
      }
    });

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error('Failed to activate superboost:', error);
    return NextResponse.json({ error: 'Failed to activate superboost' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
    methods: ['POST'],
  },
};
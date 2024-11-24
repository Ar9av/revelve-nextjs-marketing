import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    const credits = await prisma.credit.findMany({
      where: { userId }
    });

    const totalCredits = credits.reduce((total, credit) => {
      return total + (credit.expenseType === 'credit' ? credit.creditsValue : -credit.creditsValue);
    }, 0);

    if (totalCredits < 100) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        ...body,
        status: 'active'
      }
    });

    await prisma.credit.create({
      data: {
        userId,
        campaignId: campaign.id,
        expenseType: 'debit',
        creditsValue: 100,
        type: 'new-campaign',
        description: 'Campaign creation cost'
      }
    });

    return NextResponse.json(campaign, { status: 200 });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export const config = {
  runtime: 'experimental-edge',
};
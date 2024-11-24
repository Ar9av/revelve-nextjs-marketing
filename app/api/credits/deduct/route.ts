import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Ensure this path is correct

export async function POST(req: Request) {
  const { userId, campaignId, amount, type } = await req.json();

  if (!userId || !campaignId || !amount || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Check current credits
    const credits = await prisma.credit.findMany({
      where: { userId }
    });

    const totalCredits = credits.reduce((total: number, credit: { expenseType: string; creditsValue: number }) => {
      return total + (credit.expenseType === 'credit' ? credit.creditsValue : -credit.creditsValue);
    }, 0);

    if (totalCredits < amount) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // Create debit transaction
    await prisma.credit.create({
      data: {
        userId,
        campaignId,
        expenseType: 'debit',
        creditsValue: amount,
        type,
        description: `${type} cost`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to deduct credits:', error);
    return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
  }
}
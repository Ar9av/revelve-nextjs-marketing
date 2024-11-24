import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const userId = req.url.split('/').pop();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const credits = await prisma.credit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const totalCredits = credits.reduce((total: number, credit: { expenseType: string; creditsValue: number }) => {
      return total + (credit.expenseType === 'credit' ? credit.creditsValue : -credit.creditsValue);
    }, 0);

    return NextResponse.json({ credits, totalCredits });
  } catch (error) {
    console.error('Failed to fetch credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}
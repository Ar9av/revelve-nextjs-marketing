import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    console.log("TEST!")
  const { userId, code } = await req.json();

  try {
    const existingClaim = await prisma.credit.findFirst({
      where: {
        userId,
        type: 'claim-code',
        description: code
      }
    });

    if (existingClaim) {
      return NextResponse.json({ error: 'Code already claimed' }, { status: 400 });
    }

    if (code === 'REVELVEDUP') {
      await prisma.credit.create({
        data: {
          userId,
          expenseType: 'credit',
          creditsValue: 500,
          type: 'claim-code',
          description: code
        }
      });
      return NextResponse.json({ success: true, credits: 500 });
    }

    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  } catch (error) {
    console.error('Failed to claim code:', error);
    return NextResponse.json({ error: 'Failed to claim code' }, { status: 500 });
  }
}
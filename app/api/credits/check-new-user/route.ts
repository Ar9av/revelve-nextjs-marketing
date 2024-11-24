import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Ensure this path is correct

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const existingCredits = await prisma.credit.findFirst({
      where: { userId }
    });

    if (!existingCredits) {
      const newCredit = await prisma.credit.create({
        data: {
          userId,
          expenseType: 'credit',
          creditsValue: 500,
          type: 'new-login',
          description: 'Welcome gift from Revelve'
        }
      });
      return NextResponse.json({ isNewUser: true, credits: newCredit.creditsValue }, { status: 201 });
    }

    return NextResponse.json({ isNewUser: false });
  } catch (error) {
    console.error('Failed to check new user:', error);
    return NextResponse.json({ error: 'Failed to check new user' }, { status: 500 });
  }
}
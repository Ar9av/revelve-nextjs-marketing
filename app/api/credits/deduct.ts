import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';

const deductCredits = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { userId, campaignId, amount, type } = req.body;

    // Check current credits
    const credits = await prisma.credit.findMany({
      where: { userId }
    });

    const totalCredits = credits.reduce((total, credit) => {
      return total + (credit.expenseType === 'credit' ? credit.creditsValue : -credit.creditsValue);
    }, 0);

    if (totalCredits < amount) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    // Create debit transaction
    await prisma.credit.create({
      data: {
        userId,
        campaignId: campaignId,
        expenseType: 'debit',
        creditsValue: amount,
        type,
        description: `${type} cost`
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to deduct credits:', error);
    res.status(500).json({ error: 'Failed to deduct credits' });
  }
};

export default deductCredits;
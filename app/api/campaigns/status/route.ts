import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const { id } = req.url.split('/').pop();
    const { status } = await req.json();

    const campaign = await prisma.campaign.update({
      where: { id: String(id) },
      data: { status }
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to update campaign status:', error);
    return NextResponse.json({ error: 'Failed to update campaign status' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
    methods: ['PATCH'],
  },
};
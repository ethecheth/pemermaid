import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const diagrams = await prisma.diagram.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(diagrams);
}

export async function POST(request: Request) {
  const data = await request.json();
  const diagram = await prisma.diagram.create({ data });
  return NextResponse.json(diagram);
}

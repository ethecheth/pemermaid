import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

interface Params { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const diagram = await prisma.diagram.findUnique({ where: { id } });
  return NextResponse.json(diagram);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const data = await request.json();
  const diagram = await prisma.diagram.update({ where: { id }, data });
  return NextResponse.json(diagram);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  await prisma.diagram.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

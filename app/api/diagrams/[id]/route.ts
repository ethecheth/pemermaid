import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const diagram = await prisma.diagram.findUnique({ where: { id: params.id } });
  return NextResponse.json(diagram);
}

export async function PUT(request: Request, { params }: Params) {
  const data = await request.json();
  const diagram = await prisma.diagram.update({ where: { id: params.id }, data });
  return NextResponse.json(diagram);
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.diagram.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

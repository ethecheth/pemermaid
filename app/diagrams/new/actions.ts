'use server';
import { prisma } from '../../../lib/prisma';
import { redirect } from 'next/navigation';

export async function createDiagram(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;
  const content = formData.get('content') as string;
  const tagsRaw = formData.get('tags') as string | null;
  const folder = formData.get('folder') as string | null;
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : [];

  const diagram = await prisma.diagram.create({
    data: { title, description: description || null, content, tags, folder },
  });
  redirect(`/diagrams/${diagram.id}`);
} 
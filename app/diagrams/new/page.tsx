import DiagramEditor from '../../../components/DiagramEditor';
import { prisma } from '../../../lib/prisma';
import { redirect } from 'next/navigation';

export default function NewDiagramPage() {
  async function createDiagram(formData: FormData) {
    'use server';
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

  return (
    <form action={createDiagram} className="space-y-4">
      <input name="title" placeholder="Title" className="border p-2 w-full" />
      <input name="description" placeholder="Description" className="border p-2 w-full" />
      <input name="tags" placeholder="tag1, tag2" className="border p-2 w-full" />
      <input name="folder" placeholder="Folder" className="border p-2 w-full" />
      <DiagramEditor />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Save
      </button>
    </form>
  );
}

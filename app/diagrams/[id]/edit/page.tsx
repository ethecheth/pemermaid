import DiagramEditor from '../../../../components/DiagramEditor';
import { prisma } from '../../../../lib/prisma';
import { redirect } from 'next/navigation';

interface Props { params: { id: string } }

export default async function EditDiagramPage({ params }: Props) {
  const diagram = await prisma.diagram.findUnique({ where: { id: params.id } });
  if (!diagram) return <div>Diagram not found</div>;

  async function updateDiagram(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const content = formData.get('content') as string;
    const tagsRaw = formData.get('tags') as string | null;
    const folder = formData.get('folder') as string | null;
    const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : [];

    await prisma.diagram.update({
      where: { id: params.id },
      data: { title, description: description || null, content, tags, folder },
    });
    redirect(`/diagrams/${params.id}`);
  }

  return (
    <form action={updateDiagram} className="space-y-4">
      <input
        name="title"
        defaultValue={diagram.title}
        placeholder="Title"
        className="border p-2 w-full"
      />
      <input
        name="description"
        defaultValue={diagram.description ?? ''}
        placeholder="Description"
        className="border p-2 w-full"
      />
      <input
        name="tags"
        defaultValue={diagram.tags.join(', ')}
        placeholder="tag1, tag2"
        className="border p-2 w-full"
      />
      <input
        name="folder"
        defaultValue={diagram.folder ?? ''}
        placeholder="Folder"
        className="border p-2 w-full"
      />
      <DiagramEditor initialValue={diagram.content} />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Save
      </button>
    </form>
  );
}

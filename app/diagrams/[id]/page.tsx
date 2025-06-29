import { prisma } from '../../../lib/prisma';
import DiagramEditor from '../../../components/DiagramEditor';
import Link from 'next/link';

interface Props { params: Promise<{ id: string }> }

export default async function DiagramPage({ params }: Props) {
  const { id } = await params;
  const diagram = await prisma.diagram.findUnique({ where: { id } });
  if (!diagram) return <div>Diagram not found</div>;
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/" className="px-4 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 font-medium transition">
          &larr; Back to List
        </Link>
        <h1 className="text-2xl font-bold mb-0">{diagram.title}</h1>
      </div>
      <div className="flex justify-end mb-2">
        <Link href={`/diagrams/${diagram.id}/edit`} className="text-xs px-3 py-1 rounded bg-green-50 hover:bg-green-100 text-green-900 font-medium transition border border-green-200">
          Edit
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200 space-y-2">
        <div className="text-green-900 font-medium">{diagram.description}</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {diagram.tags && diagram.tags.length > 0 && diagram.tags.map((tag: string) => (
            <span key={tag} className="bg-green-200 text-green-900 px-2 py-0.5 rounded text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
        <DiagramEditor value={diagram.content} onlyPreview />
      </div>
    </div>
  );
}

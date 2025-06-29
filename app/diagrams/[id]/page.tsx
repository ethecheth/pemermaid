import { prisma } from '../../../lib/prisma';
import DiagramDisplay from '../../../components/DiagramDisplay';
import Link from 'next/link';

interface Props { params: Promise<{ id: string }> }

export default async function DiagramPage({ params }: Props) {
  const { id } = await params;
  const diagram = await prisma.diagram.findUnique({ where: { id } });
  if (!diagram) return <div>Diagram not found</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/" className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          &larr; Back to List
        </Link>
        <h1 className="text-xl font-bold mb-0">{diagram.title}</h1>
      </div>
      <div className="flex justify-end mb-2">
        <Link href={`/diagrams/${diagram.id}/edit`} className="text-blue-600">
          Edit
        </Link>
      </div>
      <p>{diagram.description}</p>
      <DiagramDisplay diagramId={diagram.id} />
    </div>
  );
}

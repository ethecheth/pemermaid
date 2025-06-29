import { prisma } from '../../../lib/prisma';
import DiagramDisplay from '../../../components/DiagramDisplay';
import Link from 'next/link';

interface Props { params: { id: string } }

export default async function DiagramPage({ params }: Props) {
  const diagram = await prisma.diagram.findUnique({ where: { id: params.id } });
  if (!diagram) return <div>Diagram not found</div>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">{diagram.title}</h1>
        <Link href={`/diagrams/${diagram.id}/edit`} className="text-blue-600">
          Edit
        </Link>
      </div>
      <p>{diagram.description}</p>
      <DiagramDisplay code={diagram.content} />
    </div>
  );
}

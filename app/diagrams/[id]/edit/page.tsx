import { prisma } from '../../../../lib/prisma';
import EditDiagramForm from './EditDiagramForm';

interface Props { params: Promise<{ id: string }> }

export default async function EditDiagramPage({ params }: Props) {
  const { id } = await params;
  const diagram = await prisma.diagram.findUnique({ where: { id } });
  if (!diagram) return <div>Diagram not found</div>;

  return <EditDiagramForm diagram={diagram} />;
}

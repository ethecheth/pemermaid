import Link from 'next/link';
import { prisma } from '../lib/prisma';

export default async function HomePage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q ?? '';
  const diagrams = await prisma.diagram.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { tags: { has: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search..."
          className="border p-2 w-full"
        />
      </form>
      <div className="flex justify-end mb-4">
        <Link href="/diagrams/new" className="px-3 py-2 bg-blue-600 text-white rounded">
          New Diagram
        </Link>
      </div>
      <ul className="space-y-2">
        {diagrams.map((d) => (
          <li key={d.id} className="border p-2 rounded">
            <Link href={`/diagrams/${d.id}`} className="font-semibold">
              {d.title}
            </Link>
            <p className="text-sm">{d.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

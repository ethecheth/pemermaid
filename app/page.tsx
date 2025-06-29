import Link from 'next/link';
import { prisma } from '../lib/prisma';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
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
    <div className="max-w-6xl mx-auto p-4">
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search diagrams..."
          className="border border-green-200 p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none bg-white"
        />
      </form>
      <div className="flex justify-end mb-6">
        <Link href="/diagrams/new" className="px-5 py-2 bg-green-400 hover:bg-green-500 text-white rounded-lg shadow font-semibold text-lg transition">
          + New Diagram
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diagrams.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-800 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-5 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between mb-1">
              <Link href={`/diagrams/${d.id}`} className="font-bold text-xl hover:underline truncate">
                {d.title}
              </Link>
              <span className="text-xs text-gray-400 ml-2">{formatDate(d.createdAt.toISOString())}</span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 mb-2">{d.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {d.tags && d.tags.length > 0 && d.tags.map((tag: string) => (
                <span key={tag} className="bg-green-200 text-green-900 px-2 py-0.5 rounded text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-auto">
              <Link href={`/diagrams/${d.id}`} className="text-xs px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 font-medium transition">View</Link>
              <Link href={`/diagrams/${d.id}/edit`} className="text-xs px-3 py-1 rounded bg-green-50 hover:bg-green-100 text-green-900 font-medium transition border border-green-200">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

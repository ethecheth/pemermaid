'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface DiagramDisplayProps {
  diagramId: string;
}

export default function DiagramDisplay({ diagramId }: DiagramDisplayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/diagrams/${diagramId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch diagram');
        const data = await res.json();
        setContent(data.content || '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [diagramId]);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined') return;
    if (!content) return;
    const cleanCode = content.trim();
    console.log('Client Diagram code:', cleanCode);
    (async () => {
      try {
        mermaid.initialize({ startOnLoad: false });
        const { svg, bindFunctions } = await mermaid.render('view', cleanCode);
        if (ref.current) {
          ref.current.innerHTML = svg;
          if (bindFunctions) bindFunctions(ref.current);
        }
      } catch (err) {
        if (ref.current) ref.current.innerHTML = 'Invalid diagram: ' + (err?.message || err);
      }
    })();
  }, [content]);

  if (loading) return <div className="border rounded p-2 bg-white dark:bg-gray-800">Loading...</div>;
  if (error) return <div className="border rounded p-2 bg-white dark:bg-gray-800 text-red-600">Error: {error}</div>;
  return <div ref={ref} className="border rounded p-2 bg-white dark:bg-gray-800" />;
}

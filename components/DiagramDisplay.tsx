'use client';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function DiagramDisplay({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    try {
      mermaid.render('view', code, (svg) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
    } catch (err) {
      if (ref.current) ref.current.innerHTML = 'Invalid diagram';
    }
  }, [code]);
  return <div ref={ref} className="border rounded p-2 bg-white dark:bg-gray-800" />;
}

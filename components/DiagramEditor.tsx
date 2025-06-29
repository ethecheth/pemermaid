'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface Props {
  initialValue?: string;
  name?: string;
}

export default function DiagramEditor({ initialValue = '', name = 'content' }: Props) {
  const [content, setContent] = useState(initialValue);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
  }, []);

  useEffect(() => {
    if (!previewRef.current) return;
    try {
      mermaid.render('editor-preview', content, (svg) => {
        if (previewRef.current) previewRef.current.innerHTML = svg;
      });
    } catch (err) {
      if (previewRef.current) previewRef.current.innerHTML = 'Invalid diagram';
    }
  }, [content]);

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full p-2 border rounded min-h-[200px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onInput={(e) => {
          const target = e.currentTarget;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
      <input type="hidden" name={name} value={content} />
      <div ref={previewRef} className="border rounded p-2 bg-white dark:bg-gray-800" />
    </div>
  );
}

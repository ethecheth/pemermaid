'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

interface DiagramEditorProps {
  diagramId?: string;
  name?: string;
  onlyEditor?: boolean;
  onlyPreview?: boolean;
  initialValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function DiagramEditor({ 
  diagramId, 
  name = 'content', 
  onlyEditor = false, 
  onlyPreview = false, 
  initialValue = '',
  value,
  onChange
}: DiagramEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [loading, setLoading] = useState(!!diagramId);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update content when value prop changes (controlled component)
  useEffect(() => {
    if (value !== undefined) {
      setContent(value);
    }
  }, [value]);

  // Fetch content only if diagramId is provided (edit mode)
  useEffect(() => {
    if (!diagramId) return;
    setLoading(true);
    setError(null);
    fetch(`./api/diagrams/${diagramId}`)
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
    if (!previewRef.current) return;
    if (typeof window === 'undefined') return;
    if (!content) return;
    try {
      mermaid.initialize({ startOnLoad: false });
      (async () => {
        try {
          const { svg, bindFunctions } = await mermaid.render('editor-preview', content.trim());
          if (previewRef.current) {
            previewRef.current.innerHTML = svg;
            if (bindFunctions) bindFunctions(previewRef.current);
          }
        } catch (err) {
          if (previewRef.current) previewRef.current.innerHTML = 'Invalid diagram: ' + (err?.message || err);
        }
      })();
    } catch (err) {
      if (previewRef.current) previewRef.current.innerHTML = 'Invalid diagram';
    }
  }, [content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  // Fullscreen handler
  const handleFullscreen = useCallback(() => {
    if (!previewRef.current) return;
    if (!document.fullscreenElement) {
      previewRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Exit fullscreen on ESC
  useEffect(() => {
    const handler = () => setIsFullscreen(false);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Center and scale SVG in fullscreen
  useEffect(() => {
    if (isFullscreen && previewRef.current) {
      const svg = previewRef.current.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.maxWidth = '100%';
        svg.style.maxHeight = '100%';
        svg.style.display = 'block';
        svg.style.margin = 'auto';
      }
    }
  }, [isFullscreen, content]);

  if (loading) return <div className="border rounded p-2 bg-white dark:bg-gray-800">Loading...</div>;
  if (error) return <div className="border rounded p-2 bg-white dark:bg-gray-800 text-red-600">Error: {error}</div>;

  // เฉพาะ textarea (editor)
  if (onlyEditor) {
    return (
      <div className="flex flex-col">
        <label className="font-medium mb-1">Edit Mermaid Code</label>
        <textarea
          className="w-full p-2 border rounded min-h-[200px] flex-1 font-mono"
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          name={name}
          rows={15}
        />
        <input type="hidden" name={name} value={content} />
      </div>
    );
  }

  // เฉพาะ preview
  if (onlyPreview) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex gap-2 mb-2">
          <button type="button" className="px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 text-xs font-medium" onClick={() => setScale((s) => Math.min(s + 0.25, 3))}>＋</button>
          <button type="button" className="px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 text-xs font-medium" onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}>－</button>
          <button type="button" className="px-2 py-1 rounded bg-green-50 hover:bg-green-100 text-green-900 text-xs font-medium" onClick={() => setScale(1)}>100%</button>
          <button type="button" className="px-2 py-1 rounded bg-green-200 hover:bg-green-300 text-green-900 text-xs font-medium" onClick={handleFullscreen}>⛶</button>
        </div>
        <div
          ref={previewRef}
          className={
            isFullscreen
              ? 'flex items-center justify-center w-full h-full bg-white dark:bg-gray-800 overflow-auto'
              : 'border rounded p-2 bg-white dark:bg-gray-800 min-h-[200px] flex-1 overflow-auto'
          }
          style={
            isFullscreen
              ? { width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
              : { transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.2s' }
          }
          onDoubleClick={handleFullscreen}
        />
        <button
          type="button"
          className="mt-2 px-4 py-1 bg-green-400 hover:bg-green-500 text-white rounded shadow text-sm self-start"
          onClick={() => {
            if (!previewRef.current) return;
            const svg = previewRef.current.innerHTML;
            if (!svg.startsWith('<svg')) return;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diagram.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Download SVG
        </button>
      </div>
    );
  }

  // ทั้ง editor และ preview (default)
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex-1 flex flex-col">
        <label className="font-medium mb-1">Edit Mermaid Code</label>
        <textarea
          className="w-full p-2 border rounded min-h-[200px] flex-1 font-mono"
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          name={name}
          rows={15}
        />
        <input type="hidden" name={name} value={content} />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="font-medium mb-1">Preview</label>
        <div className="flex gap-2 mb-2">
          <button type="button" className="px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 text-xs font-medium" onClick={() => setScale((s) => Math.min(s + 0.25, 3))}>＋</button>
          <button type="button" className="px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 text-xs font-medium" onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}>－</button>
          <button type="button" className="px-2 py-1 rounded bg-green-50 hover:bg-green-100 text-green-900 text-xs font-medium" onClick={() => setScale(1)}>100%</button>
          <button type="button" className="px-2 py-1 rounded bg-green-200 hover:bg-green-300 text-green-900 text-xs font-medium" onClick={handleFullscreen}>⛶</button>
        </div>
        <div
          ref={previewRef}
          className={
            isFullscreen
              ? 'flex items-center justify-center w-full h-full bg-white dark:bg-gray-800 overflow-auto'
              : 'border rounded p-2 bg-white dark:bg-gray-800 min-h-[200px] flex-1 overflow-auto'
          }
          style={
            isFullscreen
              ? { width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
              : { transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.2s' }
          }
          onDoubleClick={handleFullscreen}
        />
        <button
          type="button"
          className="mt-2 px-4 py-1 bg-green-400 hover:bg-green-500 text-white rounded shadow text-sm self-start"
          onClick={() => {
            if (!previewRef.current) return;
            const svg = previewRef.current.innerHTML;
            if (!svg.startsWith('<svg')) return;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diagram.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}

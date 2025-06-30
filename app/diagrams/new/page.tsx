'use client';
import DiagramEditor from '../../../components/DiagramEditor';
import { createDiagram } from './actions';
import { useState } from 'react';
import Link from 'next/link';

export default function NewDiagramPage() {
  const [mermaidContent, setMermaidContent] = useState('');

  return (
    <form action={createDiagram} className="space-y-8 p-4">
      <Link href="/" className="inline-block mb-4 px-4 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 font-medium transition">← Back to List</Link>
      <h2 className="text-2xl font-bold mb-2">New Diagram</h2>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block font-medium mb-1">Title</label>
            <input name="title" id="title" placeholder="Title" className="border p-2 w-full rounded" />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium mb-1">Description</label>
            <input name="description" id="description" placeholder="Description" className="border p-2 w-full rounded" />
          </div>
          <div>
            <label htmlFor="tags" className="block font-medium mb-1">Tags</label>
            <input name="tags" id="tags" placeholder="tag1, tag2" className="border p-2 w-full rounded" />
          </div>
          <div>
            <label htmlFor="folder" className="block font-medium mb-1">Folder</label>
            <input name="folder" id="folder" placeholder="Folder" className="border p-2 w-full rounded" />
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200">
        <div className="flex flex-col">
          <DiagramEditor 
            value={mermaidContent}
            onChange={setMermaidContent}
            onlyEditor 
          />
        </div>
        <div className="flex flex-col">
          <DiagramEditor 
            value={mermaidContent}
            onlyPreview 
          />
        </div>
      </div>
      <input type="hidden" name="content" value={mermaidContent} />
      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 bg-green-400 text-white rounded shadow hover:bg-green-500 transition">
          Save
        </button>
      </div>
    </form>
  );
}

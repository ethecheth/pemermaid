'use client';
import DiagramEditor from '../../../../components/DiagramEditor';
import { updateDiagram } from './actions';
import { useState } from 'react';
import Link from 'next/link';

interface Diagram {
  id: string;
  title: string;
  description: string | null;
  content: string;
  tags: string[];
  folder: string | null;
}

interface EditDiagramFormProps {
  diagram: Diagram;
}

export default function EditDiagramForm({ diagram }: EditDiagramFormProps) {
  const [mermaidContent, setMermaidContent] = useState(diagram.content);

  const handleSubmit = async (formData: FormData) => {
    await updateDiagram(diagram.id, formData);
  };

  return (
    <form action={handleSubmit} className="space-y-8 p-4">
      <Link href="/" className="inline-block mb-4 px-4 py-1 rounded bg-green-100 hover:bg-green-200 text-green-900 font-medium transition">← Back to List</Link>
      <h2 className="text-2xl font-bold mb-2">Edit Diagram</h2>
      
      {/* Top: Info fields */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block font-medium mb-1">Title</label>
            <input
              id="title"
              name="title"
              defaultValue={diagram.title}
              placeholder="Title"
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium mb-1">Description</label>
            <input
              id="description"
              name="description"
              defaultValue={diagram.description ?? ''}
              placeholder="Description"
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block font-medium mb-1">Tags</label>
            <input
              id="tags"
              name="tags"
              defaultValue={diagram.tags.join(', ')}
              placeholder="tag1, tag2"
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label htmlFor="folder" className="block font-medium mb-1">Folder</label>
            <input
              id="folder"
              name="folder"
              defaultValue={diagram.folder ?? ''}
              placeholder="Folder"
              className="border p-2 w-full rounded"
            />
          </div>
        </div>
      </div>

      {/* Bottom: Editor and Preview side by side */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900 p-4 rounded-lg border border-green-200">
        {/* Left: Mermaid Editor */}
        <div className="flex flex-col">
          <DiagramEditor 
            value={mermaidContent}
            onChange={setMermaidContent}
            onlyEditor 
          />
        </div>
        {/* Right: Preview */}
        <div className="flex flex-col">
          <DiagramEditor 
            value={mermaidContent}
            onlyPreview 
          />
        </div>
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name="content" value={mermaidContent} />
      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 bg-green-400 text-white rounded shadow hover:bg-green-500 transition">
          Save
        </button>
      </div>
    </form>
  );
} 
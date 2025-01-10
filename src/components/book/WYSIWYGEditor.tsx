import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from '../editor/EditorToolbar';

interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function WYSIWYGEditor({ content, onChange, className = '', style }: WYSIWYGEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none overflow-y-auto',
        style: 'height: 100%; padding: 1rem;',
      },
    },
  });

  return (
    <div className={`flex flex-col h-full ${className}`} style={style}>
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-hidden border rounded-lg bg-white">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
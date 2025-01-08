import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from './EditorToolbar';
import { TextSuggestionsMenu } from './TextSuggestionsMenu';
import { useState, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function RichTextEditor({ content, onChange, className = '' }: RichTextEditorProps) {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
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
        class: 'prose prose-sm max-w-none h-full min-h-[500px] px-8 py-6 focus:outline-none',
      },
      handleDOMEvents: {
        mouseup: (view, event) => {
          const { from, to } = view.state.selection;
          if (from === to) {
            setShowMenu(false);
            return false;
          }

          // Get the coordinates of the selection
          const { top, right } = view.coordsAtPos(to);
          const domRect = view.dom.getBoundingClientRect();
          
          setMenuPosition({
            top: top - domRect.top,
            left: right - domRect.left,
          });
          setShowMenu(true);
          return false;
        },
        blur: () => {
          // Hide menu when editor loses focus
          setShowMenu(false);
          return false;
        },
      },
    },
  });

  return (
    <div className={`flex flex-col border rounded-lg bg-white h-full relative ${className}`}>
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
        <TextSuggestionsMenu
          editor={editor}
          isOpen={showMenu}
          top={menuPosition.top}
          left={menuPosition.left}
        />
      </div>
    </div>
  );
}
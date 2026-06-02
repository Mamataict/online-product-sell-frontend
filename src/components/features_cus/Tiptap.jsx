"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";

const Tiptap = ({ editorContent, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ListItem,
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold capitalize",
        },
        levels: [2],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-2",
        },
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "shadow appearance-none min-h-[150px]  rounded w-full py-2 px-3 bg-white text-black text-sm mt-0 md:mt-3 leading-tight focus:outline-none focus:shadow-outline",
      },
    },
    content: editorContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-xs ">
      <div className="flex items-center gap-2 mb-2 px-2 py-1 border-b-gray-300 border-b ">
    
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
          title="Bold (Ctrl+B)"
        >
          <b>B</b>
        </button>

       
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
          title="Italic (Ctrl+I)"
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
          title="Heading 2"
        >
          
          <b>H2</b>
        </button>

        {/* Bullet List Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
          title="Bullet List"
        >
          <img
            src={process.env.NEXT_PUBLIC_API_URL + "/images_cus/icons/bullets-list.svg"}
            alt="Bullet list"
            className="h-4 w-4"
            width={10}
            height={10}
          />
        
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
          title="Ordered List"
        >
          <img
            src={
              process.env.NEXT_PUBLIC_API_URL +
              "/images_cus/icons/numbered-list.svg"
            }
            alt="Numbered list"
            className="h-4 w-4"
            width={10}
            height={10}
          />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;

"use client";
import "react-quill-new/dist/quill.snow.css";

import { useCallback } from "react";
import type { QuillOptionsStatic } from "react-quill-new";
import ReactQuill from "react-quill-new";

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

type MinimalEditor = {
  getText: () => string;
  getSelection: () => { index: number; length: number } | null;
};

const Editor = ({ value, onChange, maxLength = 1000 }: EditorProps) => {
  const modules: QuillOptionsStatic["modules"] = {
    toolbar: [["bold", "italic", "underline"], ["link"], [{ color: [] }]],
  };

  const formats: QuillOptionsStatic["formats"] = [
    "bold",
    "italic",
    "underline",
    "link",
    "color",
  ];

  const handleChange = useCallback(
    (
      content: string,
      _delta: unknown,
      _source: "api" | "user",
      editor: MinimalEditor,
    ) => {
      const plainText = editor.getText().trim();
      if (plainText.length > maxLength) return;
      onChange(content);
    },
    [onChange, maxLength],
  );

  const charCount = value.replace(/<[^>]*>?/gm, "").trim().length;

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Write a brief summary about yourself..."
      />

      <div className="mt-2">
        <p
          className={`
            text-sm
            ${
              charCount > maxLength * 0.9
                ? "text-red-500"
                : "text-muted-foreground"
            }
          `}
        >
          {charCount}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default Editor;

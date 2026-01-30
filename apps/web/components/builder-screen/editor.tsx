"use client";

import "react-quill-new/dist/quill.snow.css";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import type { QuillOptionsStatic } from "react-quill-new";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

const Editor = ({ value, onChange }: EditorProps) => {
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
    (content: string) => {
      onChange(content);
    },
    [onChange],
  );

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder="Write a brief summary about yourself..."
    />
  );
};

export default Editor;

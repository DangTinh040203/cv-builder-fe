"use client";

import { Trash2 } from "lucide-react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InformationInputProps {
  label: string;
  value: string;
  handleChangeLabel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: () => void;
}

const InformationInput: React.FC<InformationInputProps> = ({
  label,
  value,
  handleChangeLabel,
  handleChangeValue,
  handleDelete,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Input
        placeholder={"Label"}
        className="col-span-3"
        value={label}
        onChange={handleChangeLabel}
      />

      <Input
        className="col-span-8"
        placeholder={"Value"}
        value={value}
        onChange={handleChangeValue}
      />

      <div className="flex items-center justify-center">
        <Button size={"icon"} variant={"outline"} onClick={handleDelete}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default InformationInput;

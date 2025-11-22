"use client";
import { Upload } from "lucide-react";
import Image from "next/image";
import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadAvatarProps {
  handleSelectAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avatar: string;
}

const UploadAvatar = ({ handleSelectAvatar, avatar }: UploadAvatarProps) => {
  return (
    <div
      className={`
        group relative aspect-square overflow-hidden rounded-md shadow-xl
      `}
    >
      <Label
        htmlFor="avatar"
        className={`
          bg-background/80 absolute top-0 left-0 z-10 flex size-full
          cursor-pointer items-center justify-center opacity-0 transition-all
          group-hover:opacity-100
        `}
      >
        <Upload size={16} />
        <Input
          hidden
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleSelectAvatar}
        />
      </Label>

      <div className={`relative size-full`}>
        <Image
          src={avatar}
          fetchPriority="high"
          quality={100}
          sizes="auto"
          className="object-cover"
          alt=""
          fill
          priority
        />
      </div>
    </div>
  );
};

export default UploadAvatar;

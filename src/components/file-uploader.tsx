"use client";

import { useFileUploadMutation } from "@/hooks/useFileUploadMutation";
import { Input } from "./ui/input";
import type { ChangeEvent } from "react";
import { FileUp } from "lucide-react";
import { buttonVariants } from "./ui/button";

export function FileUploader() {
  const { mutate: uploadFile } = useFileUploadMutation();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  };

  return (
    <div
      className={buttonVariants({
        variant: "outline",
        className: "cursor-pointer !justify-start gap-3",
      })}
    >
      <FileUp className="h-4 w-4" />
      <label htmlFor="file" className="cursor-pointer">
        Upload de arquivo
      </label>
      <Input
        className="hidden"
        id="file"
        type="file"
        onChange={handleFileUpload}
      />
    </div>
  );
}

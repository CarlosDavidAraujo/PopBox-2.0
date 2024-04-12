"use client";

import { useFileUploadMutation } from "@/hooks/useFileUploadMutation";
import { Input } from "./ui/input";
import type { ChangeEvent } from "react";
import { FileUp } from "lucide-react";
import { useFolder } from "./folder-provider";

export function FileUploader() {
  const { folder } = useFolder();
  const { mutate: uploadFile } = useFileUploadMutation();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadFile({
      attachment_url: "",
      folder_id: folder?.id ?? "",
      name: file.name,
      size: file.size,
      type: file.name.split(".").pop()?.toString() ?? "",
    });
  };

  return (
    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      <label htmlFor="file" className="flex items-center gap-4">
        <FileUp className="h-5 w-5" /> Upload de arquivo
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

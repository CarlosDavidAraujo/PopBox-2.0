"use server";

import { supabase } from "@/lib/supabase";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

export const uploadFile = (parentFolderId: string, file: File) =>
  db.$transaction(async (tx) => {
    debugger;
    const formData = new FormData();
    formData.append("file", file);

    // upload file on storage
    const { data, error } = await supabase.storage
      .from("popbox")
      .upload(`${file.name}`, file);

    if (error) throw new Error(error.message);

    const session = await getServerAuthSession();
    if (!session?.user)
      throw new Error("É necessário estar logado para executar esta ação");

    // upload file on db
    const attachment = await tx.attachment.create({
      data: {
        attachment_url: data.path,
        type: file.type,
        name: file.name,
        size: file.size,
        folder_id: parentFolderId,
        created_by_id: parseInt(session.user.id),
      },
    });

    return attachment;
  });

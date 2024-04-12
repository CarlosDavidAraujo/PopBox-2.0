"use client";

import React, { useEffect, useState } from "react";
import { Dashboard } from "@uppy/react";
import { env } from "@/env";
import { supabase } from "@/lib/supabase";
import { uppy } from "@/lib/uppy";

const { STORAGE_BUCKET } = env;

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*   const {} = useQuery({
    mutationKey: ["file-upload"],
    mutationFn: () => {
      const {data, error} = await supabase.storage.from(STORAGE_BUCKET)
    }
  }) */

  useEffect(() => {
    getBucket();

    uppy.on("file-added", (file) => {
      const supabaseMetadata = {
        bucketName: STORAGE_BUCKET,
        objectName: file.name,
        contentType: file.type,
      };

      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };

      console.log("Arquivo adicionado:", file);
    });

    uppy.on("complete", (result) => {
      if (result.successful) {
        getBucket();
      } else {
        setError("O upload nâo pôde ser completado");
      }
      console.log("Upload completo! Arquivos enviados:", result.successful);
    });
  }, []);

  async function getBucket() {
    setIsLoading(true);
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list();

    if (error) {
      setError(error.message);
    } else {
      setFiles(data);
    }

    setIsLoading(false);
  }

  return (
    <Dashboard
      uppy={uppy}
      plugins={["Dashboard"]}
      metaFields={[{ id: "name", name: "Name", placeholder: "file name" }]}
    />
  );
};

export default FileUploader;

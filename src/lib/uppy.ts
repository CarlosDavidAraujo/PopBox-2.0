import { Uppy } from "@uppy/core";
import Tus from "@uppy/tus";
import { env } from "@/env";

const { SUPABASE_ANON_KEY, BEARER_TOKEN } = env;

const supabaseStorageURL = "http://127.0.0.1:44324";

export const uppy = new Uppy(/* { autoProceed: true } */)
  /*   .use(Dashboard, {
    inline: true,
    limit: 10,
    showProgressDetails: true,
  }) */
  .use(Tus, {
    endpoint: supabaseStorageURL,
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      apikey: SUPABASE_ANON_KEY,
    },
    uploadDataDuringCreation: true,
    chunkSize: 6 * 1024 * 1024,
    allowedMetaFields: [
      "bucketName",
      "objectName",
      "contentType",
      "cacheControl",
    ],
    onError: function (error) {
      console.log("Falha:", error);
    },
  });


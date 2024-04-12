import { File } from "lucide-react";
import type { ReactElement } from "react";
import {
  BsFiletypeCsv,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeGif,
  BsFiletypeJpg,
  BsFiletypeJson,
  BsFiletypeMp3,
  BsFiletypeMp4,
  BsFiletypePdf,
  BsFiletypePng,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypeTxt,
  BsFiletypeWav,
  BsFiletypeXls,
  BsFiletypeXlsx,
  BsFiletypeXml,
} from "react-icons/bs";

import { GoFileZip } from "react-icons/go";

const extensionIcons: Record<string, ReactElement> = {
  // Arquivos de texto
  txt: <BsFiletypeTxt className="h-6 w-6" />,
  // md: "fab fa-markdown",
  // Documentos do Microsoft Office
  doc: <BsFiletypeDoc className="h-6 w-6" />,
  docx: <BsFiletypeDocx className="h-6 w-6 text-blue-400" />,
  xls: <BsFiletypeXls className="h-6 w-6" />,
  xlsx: <BsFiletypeXlsx className="h-6 w-6 text-green-400" />,
  ppt: <BsFiletypePpt className="h-6 w-6" />,
  pptx: <BsFiletypePptx className="h-6 w-6" />,
  // Arquivos de imagem
  jpg: <BsFiletypeJpg className="h-6 w-6" />,
  jpeg: <BsFiletypeJpg className="h-6 w-6" />,
  png: <BsFiletypePng className="h-6 w-6" />,
  gif: <BsFiletypeGif className="h-6 w-6" />,
  // Arquivos de áudio e vídeo
  mp3: <BsFiletypeMp3 className="h-6 w-6" />,
  wav: <BsFiletypeWav className="h-6 w-6" />,
  mp4: <BsFiletypeMp4 className="h-6 w-6" />,
  //avi: <BsFiletypea />,
  // Arquivos compactados
  zip: <GoFileZip className="h-6 w-6" />,
  rar: <GoFileZip className="h-6 w-6" />,
  // Outros tipos de arquivo
  pdf: <BsFiletypePdf className="h-6 w-6 text-red-500" />,
  csv: <BsFiletypeCsv className="h-6 w-6" />,
  xml: <BsFiletypeXml className="h-6 w-6" />,
  json: <BsFiletypeJson className="h-6 w-6" />,
  // Adicione mais extensões conforme necessário
};

export const getFileExtensionIcon = (extension: string) => {
  return extensionIcons[extension] ?? <File className="h-6 w-6" />;
};

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const parseStringify = (value : unknown) => {
  return JSON.parse(JSON.stringify(value));
}


export const getFileTypeAndExtension = (fileName : string) : {
  type: string,
  extension: string,
} => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if(!extension) return {
    type: "ohters",
    extension: ""
  };
  
  
  const TypeOfFileExtensions = [
    {
      typeName : "document",
      allTheExtensions : [
      "pdf",
      "doc",
      "docx",
      "txt",
      "xls",
      "xlsx",
      "csv",
      "rtf",
      "ods",
      "ppt",
      "odp",
      "md",
      "html",
      "htm",
      "epub",
      "pages",
      "fig",
      "psd",
      "ai",
      "indd",
      "xd",
      "sketch",
      "afdesign",
      "afphoto",
      "afphoto",
      ]
    } , 
    {
      typeName : "image",
      allTheExtensions : ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"]
    } , 
    {
      typeName : "video",
      allTheExtensions : ["mp4", "avi", "mov", "mkv", "webm"]
    } , 
    {
      typeName : "audio",
      allTheExtensions : ["mp3", "wav", "ogg", "flac"]
    } 
  ];
  
  for(const fileType of TypeOfFileExtensions){
    if(fileType.allTheExtensions.includes(extension)){
      return {
        type: fileType.typeName,
        extension: extension
      };
    }
  }
   return {
    type: "other",
    extension: ""
  };
}


export type FileType = "audio" | "video" | "image" | "other" | "document"

export const getFileIcon = (
  extension: string | undefined,
  type: FileType | string,
) => {
  switch (extension) {
    // Document
    case "pdf":
      return "/assets/icons/file-pdf.svg";
    case "doc":
      return "/assets/icons/file-doc.svg";
    case "docx":
      return "/assets/icons/file-docx.svg";
    case "csv":
      return "/assets/icons/file-csv.svg";
    case "txt":
      return "/assets/icons/file-txt.svg";
    case "xls":
    case "xlsx":
      return "/assets/icons/file-document.svg";
    // Image
    case "svg":
      return "/assets/icons/file-image.svg";
    // Video
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
      return "/assets/icons/file-video.svg";
    // Audio
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
      return "/assets/icons/file-audio.svg";

    default:
      switch (type) {
        case "image":
          return "/assets/icons/file-image.svg";
        case "document":
          return "/assets/icons/file-document.svg";
        case "video":
          return "/assets/icons/file-video.svg";
        case "audio":
          return "/assets/icons/file-audio.svg";
        default:
          return "/assets/icons/file-other.svg";
      }
  }
};
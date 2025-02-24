"use server"

import { uploadFileProps } from "@/types";
import { createAdminClient } from "./appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "./appwrite/config";
import { getFileTypeAndExtension, parseStringify } from "./utils";
import { constructFileUrl } from "@/constants";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

export const handelError = async (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

export const uploadFile = async ({
  ownerId,
  accountId,
  file,
  path
}: uploadFileProps) => {
  try {
    console.log(accountId , ownerId , path);
    const { storage, databases } = await createAdminClient();

    const inputFile = InputFile.fromBuffer(file, file.name);
    // console.log(inputFile);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(), // fileId
      inputFile // Use fromBuffer for file content
    );
    
    
    
    
    const fileDetails = {
      type: getFileTypeAndExtension(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileTypeAndExtension(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    }
    
    
    const newFile = await databases.createDocument(appwriteConfig.databaseId , appwriteConfig.filesCollectionId , ID.unique() , fileDetails).catch(async (err : unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId , bucketFile.$id);
        handelError(err , "File upload failed");
    });
    
    
    console.log(newFile)
    
    revalidatePath(path);
    if(newFile) return parseStringify(newFile);
    
    
  } catch (err) {
    handelError(err, "Failed to upload file");
  }
};

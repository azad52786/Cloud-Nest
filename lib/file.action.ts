"use server";

import { DeleteFileProps, GetFileProps, RenameFileProps, UpdateUsersProps, uploadFileProps } from "@/types";
import { createAdminClient, createSessionClient } from "./appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "./appwrite/config";
import { FileType, getFileTypeAndExtension, parseStringify } from "./utils";
import { constructFileUrl } from "@/constants";
import { revalidatePath } from "next/cache";
import { ID, Models, Query } from "node-appwrite";
import { getCurrentLoginUser } from "./user.action";

export const handelError = async (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

export const uploadFile = async ({
  ownerId,
  accountId,
  file,
  path,
}: uploadFileProps) => {
  try {
    const { storage, databases } = await createAdminClient();

    const inputFile = InputFile.fromBuffer(file, file.name);

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
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDetails
      )
      .catch(async (err: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handelError(err, "File upload failed");
      });


    revalidatePath(path);
    if (newFile) return parseStringify(newFile);
  } catch (err) {
    handelError(err, "Failed to upload file");
  }
};

const getQuery = (currentUser: Models.Document , types : FileType[] , searchText : string , sort : string , limit? : number) => {
  const query = [
    Query.or([
      Query.equal("owner", [currentUser?.$id]),
      Query.contains("users", [currentUser?.email]),
    ]),
  ];
  
  
  if(types.length > 0) query.push(Query.equal("type", types));
  if(searchText) query.push(Query.contains("name", searchText));
  if(limit) query.push(Query.limit(limit));
  
  if(sort){
    const [ sortBy , orderBy ] = sort.split("-");
    
    query.push(
      orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return query;
};

export const getFiles = async ({types , query="" , sort="$createdAt-desc" , limit } : GetFileProps) => {
  try {
    const currentUser = await getCurrentLoginUser();

    if (!currentUser) throw new Error("Invalid credentials");

    const { databases } = await createAdminClient();

    const queries = getQuery(currentUser , types , query , sort , limit);

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    
    return parseStringify(files);
  } catch (error) {
    handelError(error, "Failed to get files");
  }
};

export const renameFile = async ({fileId , name , extension , path } : RenameFileProps) => {
  try {
      const {databases } = await createAdminClient();
      
      const file = await databases.updateDocument(appwriteConfig.databaseId , appwriteConfig.filesCollectionId , fileId , {
        name: `${name}.${extension}`,
      })
      
      revalidatePath(path);
      if (file) return parseStringify(file);
  } catch (error) {
    handelError(error , "failed to rename file"); 
  }
}



export const updateUsersAccess =  async ({fileId , emails, path } : UpdateUsersProps) => {
  try {
      const {databases } = await createAdminClient();
      console.log(emails);
      const updatedFile = await databases.updateDocument(appwriteConfig.databaseId , appwriteConfig.filesCollectionId , fileId , {
        users : emails
      })
      
      revalidatePath(path);
      console.log(updatedFile);
      if (updatedFile) return parseStringify(updatedFile);
  } catch (error) {
    handelError(error , "failed to update users array"); 
  }
}

export const deleteFile =  async ({fileId , bucketId , path } : DeleteFileProps) => {
  try {
      const {databases , storage } = await createAdminClient();
      const updatedFile = await databases.deleteDocument(appwriteConfig.databaseId , appwriteConfig.filesCollectionId , fileId);
      
      if(updatedFile){
        await storage.deleteFile(bucketId, fileId);
      }
      
      
      revalidatePath(path);
      if (updatedFile) return parseStringify({success : "true"});
  } catch (error) {
    handelError(error , "failed to update users array"); 
  }
}


export const getTotalUsage = async () => {
  try{
    const currentUser = await getCurrentLoginUser();
    if(!currentUser) {
      throw new Error("Invalid Cradentials");
    }
    const { databases } = await createSessionClient();
    const files = await databases.listDocuments(appwriteConfig.databaseId , appwriteConfig.filesCollectionId , [Query.equal("owner" , [currentUser.$id])]);
    const filesDetails = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used : 0 ,
      totalSize : 2 * 1024 * 1024 * 1024
    }
  
    
    files.documents.forEach((file : Models.Document) => {
      filesDetails[file.type as FileType].size += file.size;
      filesDetails.used += file.size;
      
      if(!filesDetails[file.type as FileType].latestDate || new Date(filesDetails[file.type as FileType].latestDate) < new Date(file.$updatedAt)){
          filesDetails[file.type as FileType].latestDate = file.$updatedAt;
      }
    })
    return parseStringify(filesDetails);
  }catch(error){
    handelError(error , "failed to get total usage");
  }
}


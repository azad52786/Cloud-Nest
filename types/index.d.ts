import { FileType } from "@/lib/utils";
import { Models } from "node-appwrite";
import React from "react";

export declare interface userInformation {
  $id: string;
  accountId: string;
  name: string;
  avatar: string;
  email: string;
}

export declare interface uploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}


export declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}



export declare interface RenameFileProps {
  fileId: string;
  name : string; 
  path : string; 
  extension : string;
}


export declare interface UpdateUsersProps {
  fileId: string;
  emails : string[]; 
  path : string;
}
export declare interface DeleteFileProps {
  fileId: string;
  bucketId : string; 
  path : string;
}



export declare interface ShareFileProps {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
	onRemoveEmailAccess: (email: string) => void;
}



export declare interface GetFileProps {
  types : FileType[];
  query? : string ;
  sort? : string;
  limit? : number;
}



  export interface SizeLatest {
      size : number;
      latestDate : string;
    }
    export interface UsageDetails {
        image : SizeLatest;
        document : SizeLatest;
        video : SizeLatest;
        audio : SizeLatest;
        other : SizeLatest;
        used : number;
        totalSize : number;
        
    }
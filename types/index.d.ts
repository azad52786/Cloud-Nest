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
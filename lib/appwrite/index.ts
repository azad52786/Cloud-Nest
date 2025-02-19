"use server"
import { Account, Client , Databases , Storage , Avatars } from "node-appwrite"
import { appwriteConfig } from "@/lib/appwrite/config"
export const createSessionClient = async () => {
    const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);
}
export const createAdminClient = async () => {
    const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);
    
    return {
        get account(){
            return new Account(client);
        } , 
        get databases(){
            return new Databases(client);
        } , 
        get storage(){
            return new Storage(client);
        } , 
        get avatars(){
            return new Avatars(client);
        }  
    }
}
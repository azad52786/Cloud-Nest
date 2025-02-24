"use server"
import { Account, Client , Databases , Storage , Avatars } from "node-appwrite"
import { appwriteConfig } from "@/lib/appwrite/config"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const createSessionClient = async () => {

    const session = (await cookies()).get("appwrite-session");
    // if(!session || !session.value) {
    //     return redirect("/sign-in");
    // }
    const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);
    
    client.setSession(session.value);
    
    
   
    return {
        get account(){
            return new Account(client);
        } , 
        get databases(){
            return new Databases(client);
        } 
    }
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





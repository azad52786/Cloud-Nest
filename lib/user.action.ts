"use server"
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "./appwrite"
import { appwriteConfig } from "./appwrite/config";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "./utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();
    const user = await databases.listDocuments(appwriteConfig.databaseId , appwriteConfig.usersCollectionId
     , [Query.equal("email", [email])]);

     if(user.total > 0){
        return user.documents[0];
     }
     return null;
}

export const sendEmailOtp = async (email : string) => {
    try{
        const { account } = await createAdminClient();

        const session = await account.createEmailToken(ID.unique() , email);
        return session?.userId;
    }catch(err){
        console.error(err);
        console.log("Error sending email")
        throw err;
    }
}

export const createAccount = async ({ name , email } : {
    name: string,
    email: string
}) => {
    try{
        const existingUser = await getUserByEmail(email);
        const accountId = await sendEmailOtp(email);
        if (!accountId) throw new Error("Failed to send an OTP");
        
        if(!existingUser){
            const { databases } = await createAdminClient();

            await databases.createDocument(
              appwriteConfig.databaseId,
              appwriteConfig.usersCollectionId,
              ID.unique(),
              {
                name,
                email,
                avatar: avatarPlaceholderUrl,
                accountId,
              },
            );
        }
        return parseStringify({ accountId });
    }catch(err){
        console.error(err);
        throw new Error("Account creation failed!! please try again");
    }
}



export const verifySecret = async ({ accountId , password} : {
    accountId: string,
    password: string
}) => {
    try {
        const { account } = await createAdminClient();
        
        const session = await account.createSession(accountId,password);
         
        (await cookies()).set("appwrite-session", session.secret , {
            path: "/",
            httpOnly : true , 
            secure : process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
            sameSite: process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? "none" : "lax",
        });
        
        return parseStringify({ sessionId: session.$id });
    }catch(err) {
        console.error(err);
        throw new Error("Failed to verify secret");
    }
}


export const signInUser = async ({ email } : { email: string} ) => {
    const existingUser = await getUserByEmail(email);
    
    if(!existingUser) {
        return parseStringify({
            accountId : null , 
            error : "Invalid User"
        })
    }
    
    const accountId = await sendEmailOtp(email);
    
    return parseStringify({accountId});
}



export const getCurrentLoginUser = async () => {
    try{
        const { account , databases } = await createSessionClient();
        
        const currentAccountDetails = await account.get();
        
        const user = await databases.listDocuments(appwriteConfig.databaseId , appwriteConfig.usersCollectionId , [Query.equal("accountId" , currentAccountDetails.$id)]);
        
        if(user.total <= 0) return null;
        return parseStringify(user.documents[0]);
        
    }catch(err){
        console.log(err);
    }
}



export const signOutUser = async () => {
    try{
        const { account } = await createSessionClient();
         await account.deleteSession('current');
         
         (await cookies()).delete("appwrite-session");
    }catch(err){
        console.error("Failed to sign out user");
        throw err;
    } finally {
        redirect("/sign-in")
    }
}
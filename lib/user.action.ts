"use server"
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite"
import { appwriteConfig } from "./appwrite/config";
import { avatarPlaceholderUrl } from "@/constants";
import { parseStringify } from "./utils";
import { cookies } from "next/headers";

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
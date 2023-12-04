import { INewUser } from '@/types'
import { ID, Query } from 'appwrite'
import { account, appwriteConfig, avatars, databases } from './config'

// creating user here 
export async function createUserAccount( user: INewUser ) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )
    // checking for errors 
    if(!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name)
    // saving user to the database 
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl
    })

    return newUser;
  } catch(error) {
    console.log(error)
    return error;
  }
}

// database function to save document
export async function saveUserToDB( user: {
  accountId: string;
  email: string;
  name: string,
  imageUrl: URL,
  username?: string,
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user,
    )
    return newUser
  } catch (error) {
    console.log(error)
  }
}

// signin account
export async function signInAccount(user: { email: string, password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    return session;
  } catch (error) {
    console.log(error)
  }
}

// getting current user 
export async function getCurrentUser(){
  try {
    const currentAccount = await account.get()

    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if(!currentUser) throw new Error;

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}

// sign out account 
export async function signOUtAccount() {
  try {
    const session = await account.deleteSession('current')
    
    return session;
  } catch (error) {
    console.log(error)
  }
}


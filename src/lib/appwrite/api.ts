import { INewPost, INewUser, IUpdatePost } from '@/types'
import { ID, Query } from 'appwrite'
import { account, appwriteConfig, avatars, databases, storage } from './config'

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

// Post 
export async function createPost(post: INewPost){
  try {
    // Upload image to storage
    const uploadedFile = await uploadFile(post.file[0]) 

    if(!uploadedFile) throw Error;

    // Get file url 
    const fileUrl = getFilePreview(uploadedFile.$id)
    if(!fileUrl){
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    // convert tags in an array 
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    // save post to database 
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags, 
      }
    )

    if(!newPost){
        await deleteFile(uploadedFile.$id)
        throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
  }
}

// uploaded function 
export async function uploadFile(file: File){
  try{
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadFile
  } catch (error){
    console.log(error)
  }
}


// file preview function 
export function getFilePreview(fileId: string){ 
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100,
    )

    if(!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error)
  }
}

// delete a file function 
export async function deleteFile(fileId: string){
  try {
    await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    )

    return { status: 'ok' };
  } catch (error) {
    console.log(error)
  }
}

// getting recent posts 
export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )

  if(!posts) throw Error

  return posts
}

// likePost function 
export async function likePost(postId: string, likePostArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likePostArray
      }      
    )
    if(!updatedPost) throw Error;
    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

// save post 
export async function savePost(postId: string, userId: string) {
  try {
    const savePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      postId,
      {
        user: userId,
        post: postId
      }      
    )
    if(!savePost) throw Error;
    return savePost
  } catch (error) {
    console.log(error)
  }
}

// delete post 
export async function deleteSavedPost(savedRecodeId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecodeId,
    )
    if(!statusCode) throw Error;
    return { status: 'Ok'}
  } catch (error) {
    console.log(error)
  }
}

// getting post for the edit page 
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
    if(!post) throw Error
    return post 
  } catch (error) {
    console.log(error)
  }
}

// update post 
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(post.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// deleting a post 
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) throw Error;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

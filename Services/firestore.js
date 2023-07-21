import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
} from 'firebase/firestore';
import { db } from '../config';

// ---------------------------------------USERS------------------------------------------------------

export const userProfile = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userPosts = await getDoc(collection(db, 'posts').where('userId', '==', userId));
        console.log('User data:', userDoc.data());
        console.log('User Posts:', userPosts.docs.map((doc) => doc.data()));
    } catch (error) {
        console.error('Error retrieving user document:', error);
        throw error;
    }
};

//-----------------------------------------POSTS--------------------------------------------------

export const addPostFirestore = async (userId, photo, photoName, locationName, currentLocation, likes, avatarUrl, userName) => {
  try {
    const postRef = await addDoc(collection(db, 'posts'), {
      photo: photo,
      photoName: photoName,
      locationName: locationName,
      currentLocation: currentLocation,
      userId: userId,
      likes: likes,
      avatarUrl: avatarUrl,
      userName: userName,
      createdAt: new Date()
    });
    const postSnapshot = await getDoc(postRef);
    const post = { id: postSnapshot.id, ...postSnapshot.data() };
    return post;
  } catch (error) {
    console.error('Error adding post document:', error);
    throw error;
  }
};

export const getPostsByUserIdFirestore = async (userId) => {
  try {
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(postsQuery);
    const posts = [];

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const postData = doc.data();

        const commentsQuery = query(collection(db, 'posts', doc.id, 'comments'));
        const commentsSnapshot = await getDocs(commentsQuery);

        const commentCount = commentsSnapshot.size;

        const post = {
          id: doc.id,
          avatarUrl: postData.avatarUrl,
          userName: postData.userName,
          email: postData.userId,
          photo: postData.photo,
          photoName: postData.photoName,
          likes: postData.likes,
          currentLocation: postData.currentLocation,
          locationName: postData.locationName,
          commentCount: commentCount,
        };
        posts.push(post);
      })
    );
    return posts;
  } catch (error) {
    console.error('Error retrieving posts of user:', error);
    throw error;
  }
};

export const getAllPostsFirestore = async () => {
  try {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);

    const postsQuery = query(
      collection(db, 'posts'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(postsQuery);
    const posts = [];

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const postData = doc.data();

        const commentsQuery = query(collection(db, 'posts', doc.id, 'comments'));
        const commentsSnapshot = await getDocs(commentsQuery);

        const commentCount = commentsSnapshot.size;

        const post = {
          id: doc.id,
          avatarUrl: postData.avatarUrl,
          userName: postData.userName,
          email: postData.userId,
          photo: postData.photo,
          photoName: postData.photoName, 
          likes: postData.likes,
          currentLocation: postData.currentLocation,
          locationName: postData.locationName,
          commentCount: commentCount,
        };
        posts.push(post);
      })
    );
    return posts;
  } catch (error) {
    console.error('Error retrieving posts:', error);
    throw error;
  }
};

export const addCommentFirestore = async ({postId, commentText, avatarUrl, userId}) => {
    try {
      const commentRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
        comment: commentText,
        avatarUrl: avatarUrl,
        postId: postId,
        userId: userId,
        createdAt: new Date()
      });
      const commentSnapshot = await getDoc(commentRef);
      const comment = { id: commentSnapshot.id, ...commentSnapshot.data() };
      return comment;
    } catch (error) {
      console.error('Error adding comment document:', error);
      throw error;
    }
};

export const fetchCommentsFirestore = async (postId) => {
  try {
    const commentsQuery = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const commentsSnapshot = await getDocs(commentsQuery);
    const comments = [];

    commentsSnapshot.forEach((commentDoc) => {
      const commentData = commentDoc.data();
      comments.push({
        comment: commentData.comment,
        avatarUrl: commentData.avatarUrl,
        postId: commentData.postId,
        userId: commentData.userId,
        date: commentData.createdAt.toDate(),
      });
    });
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const updateLikesFirestore = async ({ postId, likes }) => {
  try {
    const postDocRef = doc(db, 'posts', postId);
    await updateDoc(postDocRef, { likes: likes });
    const updatedPostSnapshot = await getDoc(postDocRef);
    const updatedPostData = updatedPostSnapshot.data();
    return updatedPostData;
  } catch (error) {
    console.error('Error updating likes document:', error);
    return null; 
  }
};























export const deletePost = async (postId) => {
    try {
        await deleteDoc(collection(db, 'posts', postId));
        console.log('Post document deleted successfully');
    } catch (error) {
        console.error('Error deleting post document:', error);
    }
};











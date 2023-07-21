import { setPosts, getPosts, getAllPosts, setComments, updateLikes } from './postSlice';
import { addPostFirestore, getAllPostsFirestore, getPostsByUserIdFirestore, addCommentFirestore, fetchCommentsFirestore, updateLikesFirestore } from '../../Services/firestore';

export const createPost = (post) => {
  return async (dispatch) => {
    try {
      const newPost = await addPostFirestore(
        post.userId,
        post.photo,
        post.photoName,
        post.locationName,
        post.currentLocation,
        post.likes,
        post.avatarUrl,
        post.userName,
      );

      dispatch(setPosts(newPost));
    } catch (error) {
      console.error('Error adding post document:', error);
    }
  }
};

export const fetchPosts = (userId) => {
  return async (dispatch) => {
    try {
          const posts = await getPostsByUserIdFirestore(userId);
          dispatch(getPosts(posts));
      } catch (error) {
          console.error('Error getting document:', error);
      }
  }
};

export const fetchAllPosts = () => {
  return async (dispatch) => {
    try {
      const posts = await getAllPostsFirestore();
      dispatch(getAllPosts(posts));
    } catch (error) {
      console.error('Error getting recent posts:', error);
    }
  }
};

export const addComments = (comment) => {
  return async (dispatch) => {
    try {
      const addedComment = await addCommentFirestore({
        commentText: comment.commentText,
        avatarUrl: comment.avatarUrl,
        postId: comment.postId,
        userId: comment.userId,
      });
      dispatch(setComments(addedComment));
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
};

export const fetchComments = (postId) => {
  return async (dispatch) => {
      try {
      const comments = await fetchCommentsFirestore(postId);
      dispatch(setComments(comments));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
};


export const updateLikesCount = ({ postId, likes }) => {
  return async (dispatch) => {
    try {
      await updateLikesFirestore({ postId, likes });
      dispatch(updateLikes({ postId, likes }));
    } catch (error) {
      console.error('Error updating likes document:', error);
    }
  };
};












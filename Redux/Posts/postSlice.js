import { createSlice} from '@reduxjs/toolkit';

const initialState = {
  photo: null,
  photoName: null,
  locationName: null,
  currentLocation: null,
  userId: null,
  likes: null,
  posts: [],
  postsForLastWeek: [],
  comments: []
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            const { photo, photoName, locationName, currentLocation, userId, likes } = action.payload;
            state.photo = photo;
            state.photoName = photoName;
            state.locationName = locationName;
            state.currentLocation = currentLocation;
            state.userId = userId;
            state.likes = likes;
        },
        clearPosts: (state) => {
            state.posts = [];
        },
        getPosts: (state, action) => {
            state.posts = action.payload;
        },
        getAllPosts: (state, action) => {
            state.postsForLastWeek = action.payload;
        },
        setComments: (state, action) => {
            state.comments = action.payload;
        }, 
        updateLikes: (state, action) => {
          const { postId, likes } = action.payload;
          const updatedPosts = state.posts.map((post) => 
            post.id === postId ? { ...post, likes: likes } : post
          );
          const updatedPostsForLastWeek = state.postsForLastWeek.map((post) =>
            post.id === postId ? { ...post, likes: likes } : post
          );

          state.posts = updatedPosts;
          state.postsForLastWeek = updatedPostsForLastWeek;
        },
    },
});

export const { setPosts, clearPosts, getPosts, getAllPosts, setComments, updateLikes } = postsSlice.actions;
export default postsSlice.reducer;

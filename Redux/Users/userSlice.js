import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userName: null,
    email: null,
    avatarUrl: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { displayName, email, photoURL } = action.payload;
            state.userName = displayName;
            state.email = email;
            state.avatarUrl = photoURL;
        },
        clearUser: (state) => {
            state.userName = null;
            state.email = null;
            state.avatarUrl = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

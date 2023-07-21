import { setUser, clearUser } from './userSlice';
import {
    loginUserFirebase,
    logoutUserFirebase,
    registerUserFirebase,
} from '../../Services/firebaseAuth';

export const registerUser = (userData) => {
    return async (dispatch) => {
        try {
            const user = await registerUserFirebase(userData);

            dispatch(setUser(user));
        } catch (error) {
            if (error.message === 'UserAlreadyExists') {
                throw new Error('UserAlreadyExists');
            } else {
                console.error('Error registering user:', error);
            }
        }
    };
};

export const loginUser = (userData) => {
    return async (dispatch) => {
        try {
            const user = await loginUserFirebase(userData.email, userData.password);
            dispatch(setUser(user));
        } catch (error) {
            if (error.message === 'UserNotFound') {
                throw new Error('UserNotFound');
            } else if (error.message === 'WrongCredantials') {
                throw new Error('WrongCredantials');
            } else {
                console.error('Error logging in:', error);
            }
        }
    };
};

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            await logoutUserFirebase();
            dispatch(clearUser());
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
};
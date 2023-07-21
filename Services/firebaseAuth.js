import { auth } from '../config';
import {
    signOut,
    updateProfile,
    onAuthStateChanged,
    fetchSignInMethodsForEmail,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getAuth,
    getUserByEmail,
} from 'firebase/auth';

export const registerUserFirebase = async (userData) => {
    const { login, password, email, avatar } = userData;
    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
            throw new Error('UserAlreadyExists');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: login,
            photoURL: avatar
        });

        await user.reload();
        return user;
    } catch (error) {
        console.log("Error durring registration:", error)
        throw error;
    }
};

export const loginUserFirebase = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            throw new Error('UserNotFound');
        } else if (error.code === 'auth/wrong-password') {
            throw new Error('WrongCredantials');
        } else {
        console.error('Error logging in:', error);
        }
    }
};

export const logoutUserFirebase = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

// Auth state change listener
export const authStateChanged = (onChange) => {
        onAuthStateChanged(auth, (user) => {
        onChange(user);
    });
};
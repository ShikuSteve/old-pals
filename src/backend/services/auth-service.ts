import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";

export const signup = async (name: string, email: string, password: string) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const responseUpdate = await updateProfile(response.user, {
      displayName: name,
    });

    console.log(responseUpdate);
    return response;
  } catch (err) {
    console.error("Error signing up:", err);
  }
};

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  try {
    const auth = getAuth(); //getting authentication instance
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (err) {
    console.log(err, "error logging user out");
  }
};

export const deleteAccount = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await deleteUser(user);
      console.log("User account deleted successfully");
    } else {
      console.log("No user signed in");
    }
  } catch (err) {
    console.log("Error deleting account", err);
  }
};

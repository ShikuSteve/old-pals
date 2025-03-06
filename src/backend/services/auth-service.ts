import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";

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

export const deleteAccount = async (password: string) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("No user signed in");
      return;
    }

    // Reauthenticate the user
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);

    // Delete Firestore document
    await deleteDoc(doc(db, "users", user.uid));
    console.log("User document deleted successfully");

    // Delete user authentication record
    await deleteUser(user);
    console.log("User account deleted successfully");
  } catch (err) {
    console.error("Error deleting account:", err);
  }
};

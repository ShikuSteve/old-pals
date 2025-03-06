import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
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
    const user: User | null = auth.currentUser;

    if (!user) {
      console.log("No user signed in.");
      return;
    }

    await deleteUser(user);
    console.log("User account deleted successfully!");

    // Sign out the user after successful deletion
    await auth.signOut();
    console.log("User signed out successfully.");

    // Redirect to login page or show a success message if needed
  } catch (error) {
    console.error(`Error deleting user: ${error}`);

    // if (error.code === "auth/requires-recent-login") {
    //   console.error("Re-authentication required before deletion.");
    //   // You can prompt the user to re-authenticate here
    // }
  }
};

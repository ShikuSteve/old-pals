import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  // User,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

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
    const user = auth.currentUser;

    if (!user) {
      console.log("No user signed in.");
      return;
    }

    // **Step 6: Delete Firebase Authentication User**
    await deleteUser(user);
    console.log("User account deleted from Firebase Authentication.");

    // **Step 7: Sign out the user**
    await auth.signOut();
    console.log("User signed out successfully.");

    const userId = user.uid;

    // **Step 1: Re-authenticate user before deletion**
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
    console.log("User re-authenticated.");

    // **Step 2: Delete User Document from Firestore**
    await deleteDoc(doc(db, "users", userId));
    console.log("User document deleted.");

    // **Step 3: Delete User's Friends**
    const friendsRef = collection(db, `users/${userId}/friends`);
    const friendsSnap = await getDocs(friendsRef);
    friendsSnap.forEach(async (friend) => {
      await deleteDoc(doc(db, `users/${userId}/friends`, friend.id));
    });

    // **Step 4: Remove User from Chats**
    const chatsRef = collection(db, "chats");
    const chatsSnap = await getDocs(chatsRef);
    for (const chat of chatsSnap.docs) {
      const chatData = chat.data();
      if (chatData.users.includes(userId)) {
        const updatedUsers = chatData.users.filter(
          (uid: string) => uid !== userId
        );
        await updateDoc(doc(db, "chats", chat.id), { users: updatedUsers });
      }
    }

    // **Step 5: Remove User from Groups**
    const groupsRef = collection(db, "groups");
    const groupsSnap = await getDocs(groupsRef);
    for (const group of groupsSnap.docs) {
      const groupData = group.data();
      if (groupData.members.includes(userId)) {
        const updatedMembers = groupData.members.filter(
          (uid: string) => uid !== userId
        );
        await updateDoc(doc(db, "groups", group.id), {
          members: updatedMembers,
        });

        // Delete group if user was the last member
        if (updatedMembers.length === 0) {
          await deleteDoc(doc(db, "groups", group.id));
        }
      }
    }
  } catch (error) {
    console.error(`Error deleting user: ${error}`);

    // if (error.code === "auth/requires-recent-login") {
    //   console.error("Re-authentication required before deletion.");
    //   // Prompt user to enter their password and call deleteAccount again
    // }
  }
};

// export const deleteAccount = async () => {
//   try {
//     const auth = getAuth();
//     const user: User | null = auth.currentUser;

//     if (!user) {
//       console.log("No user signed in.");
//       return;
//     }

//     await deleteUser(user);
//     console.log("User account deleted successfully!");

//     // Sign out the user after successful deletion
//     await auth.signOut();
//     console.log("User signed out successfully.");

//     // Redirect to login page or show a success message if needed
//   } catch (error) {
//     console.error(`Error deleting user: ${error}`);

//     // if (error.code === "auth/requires-recent-login") {
//     //   console.error("Re-authentication required before deletion.");
//     //   // You can prompt the user to re-authenticate here
//     // }
//   }
// }

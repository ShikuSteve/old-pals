import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { User } from "../../pages/search-friends";

interface props {
  school: string;
  homeTown: string;
  age: number;
  country: string;
  Interests: string;
  imageUrl: string;
}
export const addUser = async (uid: string, name: string, email: string) => {
  try {
    console.log("Attempting to add user:", { uid, name, email });

    const userRef = doc(db, "users", uid);

    const response = await setDoc(userRef, {
      uid,
      name,
      email,
      createdAt: new Date().toString(),
    });

    console.log("User successfully added to Firestore!");
    return response;
  } catch (error) {
    console.error("Firestore Error:", error);
  }
};

export const saveAdditionalUserInfo = async (data: props) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user found");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const response = await updateDoc(userRef, {
      school: data.school,
      homeTown: data.homeTown,
      age: data.age,
      country: data.country,
      Interests: data.Interests,
      imageUrl: data.imageUrl,
    });

    console.log("response from adding details", response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("User Data:", docSnap.data()); // Logs the user data
      return docSnap.data(); // Returns actual user data
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  const userRef = collection(db, "users");
  const userIdCurrent = auth.currentUser?.uid; // Extract UID as string or undefined

  const snapshot = await getDocs(userRef);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as User))
    .filter((user) => user.id !== userIdCurrent);
};

export const addFriend = async (friendId: string) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user signed in");
      return;
    }

    const userId = user.uid;

    const friendRef = doc(db, `users/${userId}/friends`, friendId);

    //store friend info

    const result = await setDoc(friendRef, { friendId });

    console.log(result, "result from adding a friend");
  } catch (err) {
    console.log(err, "error");
  }
};

export const checkIfFriend = async (friendId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return false;
    }

    const friendRef = doc(db, `users/${user.uid}/friends/${friendId}`);
    const friendDoc = await getDoc(friendRef);

    return friendDoc.exists(); // ✅ Returns true if friend exists
  } catch (error) {
    console.error("Error checking friend status", error);
    return false;
  }
};

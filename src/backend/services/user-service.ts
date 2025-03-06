import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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

export const createChat = async (friendId: string) => {
  if (!auth.currentUser) return;

  const currentUserId = auth.currentUser.uid;

  //generate a unique chat ID using both user IDs

  const chatId = [currentUserId, friendId].sort().join("_");

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      users: [currentUserId, friendId],
      lastMessage: "",
      timestamp: new Date(),
    });
  }
  return chatId;
};

//sending a message

export const sendMessage = async (
  chatId: string,
  message: string,
  receiverId: string
) => {
  if (!auth.currentUser) return;

  const senderId = auth.currentUser.uid;

  const messageRef = collection(db, "chats", chatId, "messages");

  await addDoc(messageRef, {
    senderId,
    receiverId,
    message,
    timestamp: serverTimestamp(),
  });
};

//retreiving messages from firebase
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}
export const listenForMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, "chats", chatId, "messages"); // Use db instead of Firestore
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      senderId: doc.data().senderId,
      receiverId: doc.data().receiverId,
      message: doc.data().message,
      timestamp: doc.data().timestamp?.toDate() ?? new Date(), // Convert Firestore timestamp
    }));
    callback(messages);
  });
};

export const fetchFriends = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    //fetch friend IDs
    const friendsRef = collection(db, "users", userId, "friends");

    const friendSnapshot = await getDocs(friendsRef);

    const friendIds = friendSnapshot.docs.map((doc) => doc.id);

    //fetch full user data for each friend
    const friendsData = await Promise.all(
      friendIds.map(async (friendId) => {
        const friendDocRef = doc(db, "users", friendId);
        const friendDoc = await getDoc(friendDocRef);
        return friendDoc.exists()
          ? { id: friendId, ...friendDoc.data() }
          : null;
      })
    );

    return friendsData.filter(Boolean) as User[];
  } catch (err) {
    console.log(err, "errorrrr");
    return [];
  }
};

// import {
//   addDoc,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { auth, db } from "../../firebase";
// import { User } from "../../pages/search-friends";
// import { updateProfile } from "firebase/auth";
// import { AudioMessage, FileMessage, ImageMessage, Message, TextMessage } from "../../components/message";
// import { FirebaseError } from "firebase/app";

// interface props {
//   school: string;
//   homeTown: string;
//   age: number;
//   country: string;
//   Interests: string;
//   imageUrl: string;
// }
// export const addUser = async (uid: string, name: string, email: string) => {
//   try {
//     console.log("Attempting to add user:", { uid, name, email });

//     const userRef = doc(db, "users", uid);

//     const response = await setDoc(userRef, {
//       uid,
//       name,
//       email,
//       createdAt: new Date().toString(),
//     });

//     console.log("User successfully added to Firestore!");
//     return response;
//   } catch (error) {
//     console.error("Firestore Error:", error);
//   }
// };

// export const saveAdditionalUserInfo = async (data: props) => {
//   try {
//     const user = auth.currentUser;

//     if (!user) {
//       console.error("No user found");
//       return;
//     }

//     const userRef = doc(db, "users", user.uid);

//     const response = await updateDoc(userRef, {
//       school: data.school,
//       homeTown: data.homeTown,
//       age: data.age,
//       country: data.country,
//       Interests: data.Interests,
//       imageUrl: data.imageUrl,
//     });

//     console.log("response from adding details", response);
//     return response;
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const updateUserInfo = async (updatedData: Partial<User>) => {
//   try {
//     const user = auth.currentUser;

//     if (!user) {
//       console.error("No user found");
//       return;
//     }

//     const userRef = doc(db, "users", user.uid);

//     // Update Firestore
//     await updateDoc(userRef, { ...updatedData });

//     console.log("User details updated successfully in Firestore");

//     // If 'name' is provided, update Firebase Authentication
//     if (updatedData.fullName) {
//       await updateProfile(user, { displayName: updatedData.fullName });
//       await user.reload(); // ✅ Refresh user to get updated displayName
//       console.log("User display name updated in Firebase Auth");
//     }
//   } catch (err) {
//     console.error("Error updating user info:", err);
//   }
// };

// export const getUser = async (userId: string) => {
//   try {
//     const userRef = doc(db, "users", userId);
//     const docSnap = await getDoc(userRef);

//     if (docSnap.exists()) {
//       console.log("User Data:", docSnap.data()); // Logs the user data
//       return docSnap.data(); // Returns actual user data
//     } else {
//       console.log("No such user!");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null;
//   }
// };

// export const fetchUsers = async (): Promise<User[]> => {
//   const userRef = collection(db, "users");
//   const userIdCurrent = auth.currentUser?.uid; // Extract UID as string or undefined

//   const snapshot = await getDocs(userRef);

//   return snapshot.docs
//     .map((doc) => ({ id: doc.id, ...doc.data() } as User))
//     .filter((user) => user.id !== userIdCurrent);
// };

// export const addFriend = async (friendId: string) => {
//   try {
//     const user = auth.currentUser;

//     if (!user) {
//       console.log("No user signed in");
//       return;
//     }

//     const userId = user.uid;

//     const friendRef = doc(db, `users/${userId}/friends`, friendId);

//     //store friend info

//     const result = await setDoc(friendRef, { friendId });

//     console.log(result, "result from adding a friend");
//   } catch (err) {
//     console.log(err, "error");
//   }
// };

// export const checkIfFriend = async (friendId: string) => {
//   try {
//     const user = auth.currentUser;
//     if (!user) {
//       console.error("User not authenticated");
//       return false;
//     }

//     const friendRef = doc(db, `users/${user.uid}/friends/${friendId}`);
//     const friendDoc = await getDoc(friendRef);

//     return friendDoc.exists(); // ✅ Returns true if friend exists
//   } catch (error) {
//     console.error("Error checking friend status", error);
//     return false;
//   }
// };

// // export const createChat = async (friendId: string) => {
// //   if (!auth.currentUser) return;

// //   const currentUserId = auth.currentUser.uid;

// //   //generate a unique chat ID using both user IDs

// //   const chatId = [currentUserId, friendId].sort().join("_");

// //   const chatRef = doc(db, "chats", chatId);
// //   const chatSnap = await getDoc(chatRef);

// //   if (!chatSnap.exists()) {
// //     try {
// //       await setDoc(chatRef, {
// //         users: [currentUserId, friendId],
// //         lastMessage: "",
// //         timestamp: new Date(),
// //       });
// //     } catch (error) {
// //       console.error("Error creating chat document:", error);
// //       // Optionally, send this error to your logging service.
// //     }
    
// //   }
// //   return chatId;
// // };

// //sending a message

// // export const sendMessage = async (
// //   chatId: string,
// //   message: string,
// //   receiverId: string
// // ) => {
// //   if (!auth.currentUser) return;

// //   const senderId = auth.currentUser.uid;

// //   const messageRef = collection(db, "chats", chatId, "messages");

// //   await addDoc(messageRef, {
// //     senderId,
// //     receiverId,
// //     message,
// //     timestamp: serverTimestamp(),
// //   });
// // };

// export const createChat = async (currentUserId:string,friendId: string) => {
//   // const user = auth.currentUser;
//   // if (!user) throw new Error("User not authenticated");

//   // const currentUserId =user.uid;

//   // Validate UID format (28 characters, alphanumeric)
//   const isValidUID = (id: string) => /^[a-zA-Z0-9]{28}$/.test(id);
//   if (!isValidUID(currentUserId) || !isValidUID(friendId)) {
//     throw new Error("Invalid UID format");
//   }

//   const chatId = [currentUserId, friendId].sort().join("_");
//   const chatRef = doc(db, "chats", chatId);
  
//   try {
//     await setDoc(chatRef, {
//       users: [currentUserId, friendId], // Must be an array of valid UIDs
//       lastMessage: "",
//       timestamp: serverTimestamp(), // Use server timestamp
//     });
//     console.log("Chat document created:", chatId);
//     return chatId;
//   } catch (error) {
//     console.error("Error creating chat:", error);
//     throw error;
//   }
// };

// // export const sendMessage = async (
// //   chatId: string,
// //   messageData: Omit<Message, "id" | "timestamp">
// // ): Promise<Message | void> => {
// //   try {
// //     console.log("Sending message to chat document:", chatId);
// //     // const user = auth.currentUser;
// //     // if (!user) return;

// //     const currentUserUid = auth.currentUser?.uid;
// //     if (!currentUserUid) {
// //       throw new Error("User not authenticated");
// //     }

// //     if (messageData.senderId !== currentUserUid) {
// //       throw new Error("senderId in message does not match current authenticated user");
// //     }

// //     const messagesRef = collection(db, "chats", chatId, "messages");
    
// //     const firestoreData: any = {
// //       ...messageData,
// //       timestamp: serverTimestamp(),
// //     };

// //     const docRef = await addDoc(messagesRef, firestoreData);
// //     const docSnap = await getDoc(docRef);
// //     console.log("Chat Document data after write:", docSnap.data());

// //     return {
// //       id: docRef.id,
// //       ...docSnap.data(),
// //       timestamp: docSnap.data()?.timestamp?.toDate() || new Date(),
// //     } as Message;
// //   } catch (error) {
// //     console.error("Error sending message:", error);
// //   }
// // };


// export const sendMessage = async (
//   chatId: string,
//   messageData: Omit<Message, "id" | "timestamp">
// ): Promise<Message | void> => {
//   try {
//     // Log the room ID for debugging
//     console.log("Sending message to chat document:", chatId);

//     // Get the current authenticated user UID.
//     const currentUserUid = auth.currentUser?.uid;
//     if (!currentUserUid) {
//       return
      
//     }

//     // Confirm that senderId matches currentUser.uid
//     if (messageData.senderId !== currentUserUid) {
//       throw new Error("senderId in message does not match current authenticated user");
//     }

//     // Reference the messages subcollection in the chat document.
//     const messagesRef = collection(db, "chats", chatId, "messages");

//     // Prepare the data with a server timestamp.
//     const firestoreData: any = {
//       ...messageData,
//       timestamp: serverTimestamp(),
//     };

//     // Optionally, test connectivity by writing a test document.
//     // await setDoc(doc(db, "test", "doc"), { foo: "bar" });

//     // Add the document to Firestore.
//     const docRef = await addDoc(messagesRef, firestoreData);
//     const docSnap = await getDoc(docRef);
//     console.log("Chat Document data after write:", docSnap.data());

//     // Return the complete message, converting timestamp if available.
//     return {
//       id: docRef.id,
//       ...docSnap.data(),
//       timestamp: docSnap.data()?.timestamp?.toDate() || new Date(),
//     } as Message;
//   } catch (error: any) {
//     // Log detailed error information if it's a FirebaseError.
//     if (error instanceof FirebaseError) {
//       console.error("Error sending message:", error.message);
//       console.error("Error code:", error.code);
//       console.error("Error details:", error.customData);
//     } else {
//       console.error("Error sending message:", error);
//     }
//   }
// };

// export const fetchMessages = async (chatId: string): Promise<Message[]> => {
//   try {
//     const messagesRef = collection(db, "chats", chatId, "messages");
//     const q = query(messagesRef, orderBy("timestamp", "asc"));
//     const snapshot = await getDocs(q);

//     return snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//       timestamp: doc.data().timestamp?.toDate() || new Date(),
//     } as Message));
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return [];
//   }
// };

// //retreiving messages from firebase
// // interface Message {
// //   id: string;
// //   senderId: string;
// //   receiverId: string;
// //   message: string;
// //   timestamp: Date;
  
// // }
// // export const listenForMessages = (
// //   chatId: string,
// //   callback: (messages: Message[]) => void
// // ) => {
// //   const messagesRef = collection(db, "chats", chatId, "messages"); // Use db instead of Firestore
// //   const q = query(messagesRef, orderBy("timestamp", "asc"));

// //   return onSnapshot(q, (snapshot) => {
// //     const messages: Message[] = snapshot.docs.map((doc) => ({
// //       id: doc.id,
// //       senderId: doc.data().senderId,
// //       receiverId: doc.data().receiverId,
// //       message: doc.data().message,
// //       timestamp: doc.data().timestamp?.toDate() ?? new Date(), // Convert Firestore timestamp
// //     }));
// //     callback(messages);
// //   });
// // };

// export const listenForMessages = (
//   chatId: string,
//   callback: (messages: Message[]) => void
// ) => {
//   const messagesRef = collection(db, "chats", chatId, "messages");
//   const q = query(messagesRef, orderBy("timestamp", "asc"));

//   return onSnapshot(q, (snapshot) => {
//     const messages: Message[] = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       const messageType = data.type; // Assuming you have a 'type' field in your Firestore documents

//       switch (messageType) {
//         case "text":
//           return {
//             id: doc.id,
//             senderId: data.senderId,
//             timestamp: data.timestamp?.toDate() ?? new Date(),
//             type: "text",
//             content: data.message, // Assuming 'message' is the content for text messages
//           } as TextMessage;

//         case "image":
//           return {
//             id: doc.id,
//             senderId: data.senderId,
//             timestamp: data.timestamp?.toDate() ?? new Date(),
//             type: "image",
//             content: data.imageUrl, // Assuming you have an 'imageUrl' field
//             caption: data.caption,
//           } as ImageMessage;

//         case "file":
//           return {
//             id: doc.id,
//             senderId: data.senderId,
//             timestamp: data.timestamp?.toDate() ?? new Date(),
//             type: "file",
//             content: data.fileUrl, // Assuming you have a 'fileUrl' field
//             caption: data.caption,
//           } as FileMessage;

//         case "audio":
//           return {
//             id: doc.id,
//             senderId: data.senderId,
//             timestamp: data.timestamp?.toDate() ?? new Date(),
//             type: "audio",
//             content: data.audioUrl, // Assuming you have an 'audioUrl' field
//           } as AudioMessage;

//         default:
//           throw new Error("Unknown message type");
//       }
//     });
//     callback(messages);
//   });
// };

// export const fetchFriends = async () => {
//   try {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return [];

//     //fetch friend IDs
//     const friendsRef = collection(db, "users", userId, "friends");

//     const friendSnapshot = await getDocs(friendsRef);

//     const friendIds = friendSnapshot.docs.map((doc) => doc.id);

//     //fetch full user data for each friend
//     const friendsData = await Promise.all(
//       friendIds.map(async (friendId) => {
//         const friendDocRef = doc(db, "users", friendId);
//         const friendDoc = await getDoc(friendDocRef);
//         return friendDoc.exists()
//           ? { id: friendId, ...friendDoc.data() }
//           : null;
//       })
//     );

//     return friendsData.filter(Boolean) as User[];
//   } catch (err) {
//     console.log(err, "errorrrr");
//     return [];
//   }
// };

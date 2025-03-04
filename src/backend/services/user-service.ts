import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

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

export const getUsers = async () => {
  const users = doc(db, "users");
  return await getDoc(users);
};

import mongoose, { Types } from "mongoose";
import { User } from "../model";
import {  UserProfileInput } from "../types";
import bcrypt from "bcrypt";



export async function userProfile({ userId, profileData }: UserProfileInput) {
  console.log("Updating user profile with:", profileData);

  const allowedUpdates = {
    age: profileData.age,
    email: profileData.email,
    fullName: profileData.fullName,
    school: profileData.school,
    country: profileData.country,
    hometown: profileData.hometown && profileData.hometown.trim() !== "" 
      ? profileData.hometown 
      : undefined, // Prevent saving empty strings
    interest:Array.isArray(profileData.interest) && profileData.interest.length > 0
    ? profileData.interest
    : undefined,
    profilePhoto: profileData.profilePhoto
  };

  // Remove undefined values so they don’t overwrite existing data
  const filteredUpdates = Object.fromEntries(
    Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
  );

  console.log("Final update object:", filteredUpdates);

  const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true });

  console.log("Updated user:", updatedUser);
  return updatedUser;
}

export async function deleteUserByEmail(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required to delete a user");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // Compare provided password with hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  // Delete user
  await User.findOneAndDelete({ email });

  return { message: "User deleted successfully" };
}






export async function addFriend(userId: string, friendId: string) {
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new Error("User or friend not found");
  }

  // Check if the friend is already added by comparing string representations
  if (user.friends.some((id: Types.ObjectId) => id.toString() === friendId)) {
    throw new Error("Friend already added");
  }

  // Add each user to the other's friends list by pushing ObjectIds
  user.friends.push(friend._id);
  friend.friends.push(user._id);

  await user.save();
  await friend.save();

  return { message: "Friend added successfully" };
}


export async function getUserFriendsHandler(userId: string) {
  const user = await User.findById(userId).populate("friends");
  if (!user) {
    throw new Error("User not found");
  }
  return user.friends;
}

export async function checkFriendStatus(userId:string,friendId:string){
  if(!userId||!friendId){
    throw new Error("The UserId and the FriendId are required")
  }
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new Error("User or friend not found");
  }

  const isFriend=user.friends.some((id:any)=>id.toString()===friendId)
return isFriend

}

// export async function getUsersHandler(userId: string) {
//   const users = await User.find({
//     _id: { $ne: userId },
//     profilePhoto: { $exists: true, $ne: "" },
//     country: { $exists: true, $ne: "" },
//     hometown: { $exists: true, $ne: "" },
//     school: { $exists: true, $ne: "" },
//     hobbies: { $exists: true, $not: { $size: 0 } },
//     age: { $exists: true, $ne: null },
//   });
//   return users;
// }

export async function getUsersHandler(userId: string) {
  const users = await User.find({
    _id: { $ne: userId },
  });
  return users;
}

export async function getUserProfiles(userId:string){
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }
  const user=await User.findById(userId).select("-password")

  if (!user) {
    throw new Error("User not found");
  }

  return user

}
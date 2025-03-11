import { Router } from "express";
import { addingFriends, checkIfFriend, deleteMessage, deleteUser, editProfile, fetchMessage, getUser, getUserFriendsController, getUsersController, saveMessage, SignUpController, singinController } from "../controllers/main";
;

const mainroutes=Router()

mainroutes.post("/signup",SignUpController)
mainroutes.post("/signin",singinController)
mainroutes.delete("/delete",deleteUser)

mainroutes.put("/user/:userId/profile",editProfile)
mainroutes.post("/friends",addingFriends)
mainroutes.get("/user/:userId/friends", getUserFriendsController);
mainroutes.get("/users/:userId/exclude", getUsersController);
mainroutes.get("/user/:id", getUser);
mainroutes.get("/friends/status/:userId/:friendId", checkIfFriend);


mainroutes.get("/messages",fetchMessage)
mainroutes.post("/messages",saveMessage)
mainroutes.delete("/messages/:msgId", deleteMessage);


export { mainroutes };

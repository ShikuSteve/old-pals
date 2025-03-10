import type { NextFunction, Request, Response } from "express";
import { SignIn, signupUser } from "../handlers/signup-signin";
import { addFriend, checkFriendStatus, deleteUserByEmail, getUserFriendsHandler, getUserProfiles, getUsersHandler, userProfile } from "../handlers/user-porfile";
import { deleteMessagesHandler, fetchMessagesHandler, saveMessageHandler } from "../handlers/messages";
import { MessageData } from "../types";



export async function SignUpController(req:Request,res:Response,next:NextFunction){
try{
    const { fullName, email, password } = req.body;
    const result=await signupUser(fullName, email, password)
    res.status(201).json(result)
}catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      next(error);
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
      next(new Error("An unknown error occurred"));
    }
  }
  
}

export async function singinController(req:Request,res:Response,next:NextFunction){
    try{
        const { email, password } = req.body;
        const result = await SignIn( email, password );
        res.status(200).json(result);
    }catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
          next(error);
        } else {
          res.status(400).json({ error: "An unknown error occurred" });
          next(new Error("An unknown error occurred"));
        }
      }
      
}

export async function editProfile(req:Request,res:Response,next:NextFunction) {
    try{
        const userId=req.params.userId
        // Extract form fields from req.body. They are expected to be sent as JSON fields.
    const profileData = { ...req.body };
    if (req.file) {
        profileData.profilePhoto = req.file.path; // Adjust as needed (e.g., if you store a public URL)
      }

      const updatedUser = await userProfile({userId, profileData});
    res.status(200).json(updatedUser);
      
    }catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
          next(error);
        } else {
          res.status(400).json({ error: "An unknown error occurred" });
          next(new Error("An unknown error occurred"));
        }
      }
      
}


export async function deleteUser(req:Request,res:Response,next:NextFunction){
  try{
    const { email, password } = req.body;
    const response = await deleteUserByEmail(email, password);
    res.json(response);
  }catch(error:unknown){
    console.log(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
          next(error);
        } else {
          res.status(400).json({ error: "An unknown error occurred" });
          next(new Error("An unknown error occurred"));
        }
  }
}

export async function addingFriends(req:Request,res:Response,next:NextFunction) {
    try{
        const { userId, friendId } = req.body;
        const result = await addFriend(userId, friendId);
    res.status(200).json(result);
    }catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
          next(error);
        } else {
          res.status(400).json({ error: "An unknown error occurred" });
          next(new Error("An unknown error occurred"));
        }
      }
      
}

export async function getUserFriendsController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    const userId=req.params.userId
      const friends = await getUserFriendsHandler(userId);
      res.status(200).json({ friends });
    } catch (error: unknown) {
      console.log(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
          next(error);
        } else {
          res.status(400).json({ error: "An unknown error occurred" });
          next(new Error("An unknown error occurred"));
        }
    }
  }

export async function checkIfFriend(req: Request, res: Response, next: NextFunction) {
  try{
    const {userId,friendId}=req.params
    const isFriend=await checkFriendStatus(userId,friendId)
    res.status(200).json({ isFriend });
  }catch(error:unknown){
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      next(error);
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
      next(new Error("An unknown error occurred"));
    }
  }
}

  export async function getUsersController(req: Request, res: Response, next: NextFunction) {
    try{
          
    const { userId } = req.params as { userId: string };

   
    const users = await getUsersHandler(userId);
    res.status(200).json({ users });
    }catch(error:unknown){
        console.log(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
          next(error);
        } else {
          res.status(400).json({ error: "An unknown error occurred" });
          next(new Error("An unknown error occurred"));
        }
    }
  }

  export async function getUser(req: Request, res: Response, next: NextFunction){
    try{
        const userId=req.params.id
        console.log(userId)
        const user=await getUserProfiles(userId) 
        res.status(200).json(user);
    }catch(error:unknown){
        console.log(error);
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
          next(error);
        } else {
          res.status(400).json({ error: "An unknown error occurred" });
          next(new Error("An unknown error occurred"));
        }
    }
  }

  export async function fetchMessage(req: Request, res: Response, next: NextFunction){
    try{
      const messages = await fetchMessagesHandler(req.query.room as string);
      res.json(messages);

    }catch(error:unknown){
      console.log(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        next(error);
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
        next(new Error("An unknown error occurred"));
      }
    }
  }

  export async function saveMessage(req: Request, res: Response, next: NextFunction){
    try{

      const newMessage = await saveMessageHandler(req.body as MessageData);
      res.status(201).json(newMessage);

    }catch(error:unknown){
      console.log(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        next(error);
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
        next(new Error("An unknown error occurred"));
      }
    }
  }

  export async function deleteMessage(req: Request, res: Response, next: NextFunction){
    try{
      const response = await deleteMessagesHandler(req.params.msgId as string);
      res.json(response);
    }catch(error:unknown){
      console.log(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        next(error);
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
        next(new Error("An unknown error occurred"));
      }
    }
  }
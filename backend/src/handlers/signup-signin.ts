
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../model";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

export async function signupUser( fullName:string, email:string, password:string ) {
const existingUser=await User.findOne({email})
if(existingUser){
    throw new Error('Email already in use');
}

 // Hash the password before saving
 const saltRounds = 10;
 const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create and save the new user
  const newUser = new User({ fullName, email, password: hashedPassword });
  const savedUser = await newUser.save();

   // Create a JWT token for the new user
   const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: '1d' });
   return { user: savedUser, token };
}

export async function SignIn(email:string,password:string){
    const user=await User.findOne({email})
    if(!user){
        throw new Error('The User Does Not exist');
    }

      // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Create a JWT token upon successful authentication
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  return { user, token };

}
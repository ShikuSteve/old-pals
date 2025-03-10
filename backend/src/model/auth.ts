import mongoose from "mongoose"
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // Basic account info (registration)
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Additional profile details (filled later)
  image: { type: String },         // Could be used for a cover or profile image URL
  country: { type: String },
  contryCode:{type:String},
  hometown: { type: String },
  interest:[{type:String}],
  age: { type: Number },
  school: { type: String },
  profilePhoto: { type: String },  // URL to profile photo
  
  // Friend relationships (store array of user references)
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const User= mongoose.model('User', UserSchema);
export {User}

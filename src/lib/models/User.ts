import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    // NextAuth adapter fields
    name: { type: String },
    email: { type: String, unique: true },
    emailVerified: { type: Date },
    image: { type: String },
    // Custom fields
    tokens: { type: Number, default: 1 },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
  },
  { timestamps: true },
);

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
export default User;

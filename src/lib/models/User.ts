import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    // NextAuth adapter fields
    name: { type: String },
    email: { type: String, unique: true },
    email_verified: { type: Date },
    image: { type: String },
    // Custom fields
    credits: { type: Number, default: 3 },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
export default User;

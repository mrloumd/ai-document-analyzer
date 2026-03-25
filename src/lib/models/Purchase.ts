import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    pack_id: { type: String, required: true },
    credits: { type: Number, required: true },
    amount: { type: Number, required: true }, // PHP (e.g. 150)
    currency: { type: String, default: "PHP" },
    // PayMongo identifiers
    checkout_session_id: { type: String },
    payment_id: { type: String },
    status: { type: String, default: "paid" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const Purchase =
  mongoose.models.Purchase ?? mongoose.model("Purchase", PurchaseSchema);
export default Purchase;

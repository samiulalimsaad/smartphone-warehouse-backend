import mongoose from "mongoose";
const { model, Schema } = mongoose;
const inventorySchema = new Schema(
    {
        name: String,
        images: [String],
        quantity: Number,
        price: Number,
        supplierName: String,
        email: String,
        description: [String],
        brandName: String,
    },
    { timestamps: true }
);

export const Inventory = model("inventory", inventorySchema);

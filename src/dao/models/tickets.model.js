import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartInTicketSchema = new Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts", // Referencia al modelo de carritos
  },
});

const ticketSchema = new Schema(
  {
    purchase_datetime: {
      type: Date,
      // required: true,
    },
    cart: [cartInTicketSchema], // Referencia al modelo de carritos
    quantity: {
      type: Number,
      // required: true,
    },
    purchaser: {
      type: String,
      // required: true,
    },
    code: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.plugin(mongoosePaginate);

export const ticketsModel = model("Ticket", ticketSchema);

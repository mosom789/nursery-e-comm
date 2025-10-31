const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
    userId:{type: Schema.Types.ObjectId, ref:'users'},
    date : Date,
    // items : Array(Schema.Types.Mixed),
     items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "products", 
        // required: true
      },
      quantity: { type: Number, required: true }
    }
  ],
    paymentType: String,
    address: Schema.Types.Mixed,
    totalAmount: Number,
    status : String

},
{ timestamps: true }
);

const Order = mongoose.model("orders",orderSchema);
module.exports = Order;
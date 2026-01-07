  import mongoose from "mongoose";

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  price1hr: { type: Number, required: true },
  price2hr: { type: Number, required: true },
});

const Hall = mongoose.model("Hall", hallSchema);
export default Hall;
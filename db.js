const mongoose = require('mongoose');

const uri = "mongodb+srv://pawaskarshifa70_db_user:dqT4UP110Z8n0EGP@cluster0.mongodb.net/alishanDB?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

module.exports = mongoose;

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/wanawebdb", {
    serverSelectionTimeoutMS: 5000, // Fail after 5 seconds instead of 10
}).then(() => {
    console.log("Connected to mongodb");
}).catch((err) => {
    console.error("mongodb connection error:", err);
});

// Add this line to stop the "buffering" hanging
mongoose.set('bufferCommands', false); 

module.exports = mongoose;
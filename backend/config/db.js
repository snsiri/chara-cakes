import mongoose from "mongoose";
const dburl = "mongodb_url";

// Only set strictQuery if you want strict query mode
mongoose.set("strictQuery", true);

const connection = async () => {
    try {
        await mongoose.connect(dburl); // No options needed
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit();
    }
};

export default connection;

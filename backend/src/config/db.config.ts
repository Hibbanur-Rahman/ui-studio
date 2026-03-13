import mongoose from "mongoose";

const dbConnection = (url: string) => {
    mongoose.connect(url);

    const db = mongoose.connection;

    db.on("error", (error) => {
        console.error("MongoDb connection error:", error);
    });
    db.once("open", () => {
        console.log("MongoDB connected successfully");
    })
}

export default dbConnection;
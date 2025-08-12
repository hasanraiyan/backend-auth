import dotenv from "dotenv"
import app from "./server.js"
import connectDB from "./db/index.js";
dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 3000;

try {
    connectDB();
    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
    })

} catch (error) {
    console.error("Failed to connect to the database. Exiting...");
    process.exit(1);
}

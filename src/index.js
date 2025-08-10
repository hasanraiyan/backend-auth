import dotenv from "dotenv"
import app from "./server.js"

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT} in ${process.env.NODE_VERSION} mode.`);
})

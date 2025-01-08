import connectDatabase from "./database/db.js"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import {fetchAndSaveQuestions} from "./controllers/questionLoad.controller.js"


const server = express();

dotenv.config({
    path: '../env'
});

console.log("Cors origin env", process.env.CORS_ORIGIN);

const corsOptions = {
    origin: [process.env.CORS_ORIGIN, "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

server.use(cors(corsOptions));


server.get("/", (_, res) => {
    res.send("Server up and running");

})

connectDatabase()
.then(() => {
    try{
        // fetchAndSaveQuestions();
        server.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running at port : ${process.env.PORT || 5000}`);
        })
    }
    catch(error){
        console.log("Server Error", error);
    }
})
.catch((err) => {
    console.log("MongoDB connection failed !!!", err);
})


server.use(express.json( {limit: "16kb"}))
server.use(express.urlencoded({extended: true, limit: "16kb"}));
server.use(express.static("public"))
server.use(cookieParser());

import questionRoutes from "./routes/question.routes.js"

server.use("/api/questions", questionRoutes);

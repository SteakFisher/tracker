import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import v1 from "./api/v1/v1";

dotenv.config();

const app = express();

var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(cookieParser());

app.use(express.static("public"));
const port = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use("/v1", v1);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

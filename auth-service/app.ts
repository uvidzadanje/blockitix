import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import route from "./routes"

dotenv.config();

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

route(app);

export default app;
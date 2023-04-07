import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const PORT: number = Number.parseInt(process.env.PORT as string);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://127.0.0.1:${PORT}`);
});

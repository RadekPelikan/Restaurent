import express from "express";
import cors from "cors";
import morgan from "morgan";
import { auth } from "express-openid-connect";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

export const prisma = new PrismaClient();

const PORT = process.env.API_PORT ?? 3000;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: `http://localhost:${PORT}`,
};

app.use(auth(config));

import { restaurantsRouter } from "~/routes";

app.use("/restaurants", restaurantsRouter);

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? req.oidc.user : "Logged out");
});

(async () => {
  app.listen(PORT, () => {
    console.log(`now listening on port ${PORT}`);
    console.log(`Open on: http://localhost:${PORT}`);
  });
})()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

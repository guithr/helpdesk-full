import { errorHandler } from "./middlewares/errorHandler";
import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ frontend (Vite)
    credentials: true, // ✅ permite cookies / headers com credenciais
  })
);

app.use(routes);

app.use(errorHandler);

export { app };

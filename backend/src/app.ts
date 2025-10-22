import { errorHandler } from "./middlewares/errorHandler";
import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.use(errorHandler);

export { app };

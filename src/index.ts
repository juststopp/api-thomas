require("dotenv").config();

import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

import router from "./router";
import Logger from "./utils/Logger";

/**
 * Application creation. Applying global middlewares
 */

const app = express();
const logger = new Logger({ production: false });

app.use(
	cors({
		credentials: true,
	})
);

app.use(
	(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		logger.log("INFO", req.method + " " + req.url);
		next();
	}
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

/**
 * Starting HTTP Server.
 */

const server = http.createServer(app);
server.listen(process.env.PORT, () => {
	logger.log(
		"SUCCESS",
		`Server now running: http://localhost:${process.env.PORT}.`
	);
});

/**
 * Connection to the MongoDB Database. MONGO_URL retrieved from the .env file.
 */

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL as string).then(() => {
	logger.log("SUCCESS", "Connecté à la base de données.");
});
mongoose.connection.on("error", (err: Error) => {
	logger.log("ERROR", err);
});

/**
 * Registering main router for the /api route.
 */

app.use(`/${process.env.API_ROUTE}`, router());

logger.log(
	"INFO",
	`API is reachable at this URL: http://localhost:${process.env.PORT}/${process.env.API_ROUTE}`
);

import express from "express";
import { get, merge } from "lodash";

import Logger from "../utils/Logger";
import { getUserById, getUserBySessionToken } from "../db/Users";

const logger = new Logger({ production: false });

export const isAccountOwner = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const { userId } = req.params;
		const currentUserId = get(req, "identity._id") as String;

		if (!currentUserId) return res.sendStatus(400);
		if (currentUserId.toString() !== userId) return res.sendStatus(403);

		return next();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(400);
	}
};

export const isAuthenticated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const sessionToken = req.cookies["API-AUTH"];

		if (!sessionToken) return res.sendStatus(400);

		const existingUser = await getUserBySessionToken(sessionToken);

		if (!existingUser) return res.sendStatus(401);

		merge(req, { identity: existingUser });

		return next();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(400);
	}
};

export const isValidated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const loggedInUserId = get(req, "identity._id") as String;
		if (!loggedInUserId) return res.sendStatus(400);

		const user = await getUserById(loggedInUserId);
		if (!user) return res.sendStatus(401);
		if (!user.validated) return res.sendStatus(403);

		return next();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(400);
	}
};

export const isUserValidated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const { userId } = req.params;
		if (!userId) return res.sendStatus(400);

		const user = await getUserById(userId);
		if (!user) return res.sendStatus(401);
		if (!user.validated) return res.sendStatus(403);

		return next();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(400);
	}
};

export const isAdmin = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const loggedInUserId = get(req, "identity._id") as String;
		if (!loggedInUserId) return res.sendStatus(400);

		const user = await getUserById(loggedInUserId);
		if (!user) return res.sendStatus(401);
		if (!user.isAdmin) return res.sendStatus(403);

		return next();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(400);
	}
};

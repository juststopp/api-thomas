import express from "express";
import { createUser, getUserByEmail } from "../db/Users";
import { authentication, random } from "../helpers";
import Logger from "../utils/Logger";
import Mailer from "../helpers/Mailer";

import messages from "../languages/messages";

const logger = new Logger({ production: false });
const mailer = new Mailer(messages.mails.titles.ACCOUNT_CREATED);

/**
 *
 * @param req {express.Request}
 * @param res {express.Response}
 *
 * @returns {express.Response}
 */
export const login = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) return res.sendStatus(400);

		if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) == false)
			return res.sendStatus(400);

		if (
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g.test(
				password
			) == false
		)
			return res.sendStatus(400);

		const user = await getUserByEmail(email).select(
			"+authentication.salt +authentication.password"
		);

		if (!user) return res.sendStatus(400);

		const exceptedHash = authentication(user.authentication.salt, password);
		if (user.authentication.password !== exceptedHash)
			return res.sendStatus(403);

		const salt = random();
		user.authentication.sessionToken = authentication(
			salt,
			user._id.toString()
		);
		await user.save();

		res.cookie("API-AUTH", user.authentication.sessionToken, {
			domain: "localhost",
			path: "/",
		});
		return res.status(200).send(user).end();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(500);
	}
};

/**
 *
 * @param req {express.Request}
 * @param res {express.Response}
 *
 * @returns {express.Response}
 */
export const register = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password, username } = req.body;

		if (!email || !password || !username) return res.sendStatus(400);

		const userExists = await getUserByEmail(email);

		if (userExists) return res.sendStatus(400);

		const salt = random();
		const user = await createUser({
			email,
			username,
			authentication: {
				salt,
				password: authentication(salt, password),
			},
		});

		mailer.send(email, messages.mails.messages.ACCOUNT_CREATED);

		return res.status(200).json(user).end();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(500);
	}
};

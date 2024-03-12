import express from "express";
import { get } from "lodash";

import { getUserRecords } from "../utils/Airtable";
import { deleteUserById, getUserById } from "../db/Users";
import Logger from "../utils/Logger";

const logger = new Logger({ production: false });

/**
 *
 * @param req {express.Request}
 * @param res {express.Response}
 *
 * @returns {express.Response}
 */
export const getUser = async (req: express.Request, res: express.Response) => {
	try {
		const { id } = req.params;

		if (!id) return res.sendStatus(400);

		const users = await getUserById(id);

		return res.status(200).json(users);
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(400);
	}
};

/**
 *
 * @param req {express.Request}
 * @param res {express.Response}
 *
 * @returns {express.Response}
 */
export const deleteUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params;

		const deletedUser = await deleteUserById(userId);

		return res.status(200).json(deletedUser);
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(400);
	}
};

/**
 *
 * @param req {express.Request}
 * @param res {express.Response}
 *
 * @returns {express.Response}
 */
export const updateUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params;
		const { username, email } = req.body;

		if (!username || !email) return res.sendStatus(400);

		const user = await getUserById(userId);
		if (!user) return res.sendStatus(400);

		user.username = username;
		user.email = email;

		await user.save();

		return res.status(200).json(user).end();
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
export const getRecords = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const userId = get(req, "identity._id") as string;
		if (!userId) return res.sendStatus(400);

		const user = await getUserById(userId);
		if (!user) return res.sendStatus(400);

		const records = await getUserRecords(userId);
		return res.status(200).json(records).end();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(500);
	}
};

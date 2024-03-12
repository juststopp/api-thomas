import express from "express";

import { getUserById } from "../db/Users";
import { getRecords } from "../utils/Airtable";
import Logger from "../utils/Logger";
import Mailer from "../helpers/Mailer";

import messages from "../languages/messages";

const logger = new Logger({ production: false });
const mailer = new Mailer(messages.mails.titles.ACCOUNT_VALIDATED);

/**
 *
 * @param req {express.Request}
 * @param res {express.Response}
 *
 * @returns {express.Response}
 */
export const validateUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params;
		if (!userId) return res.sendStatus(400);

		const user = await getUserById(userId);
		if (!user) return res.sendStatus(400);

		user.validated = true;

		await user.save();
		mailer.send(user.email, messages.mails.messages.ACCOUNT_VALIDATED);

		return res.status(200).json(user).end();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(500);
	}
};

export const listRecords = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const records = await getRecords();
		return res.status(200).json(records).end();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(500);
	}
};

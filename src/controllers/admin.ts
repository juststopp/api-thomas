import express from "express";

import { deleteUserById, getUserById } from "../db/Users";
import { getRecords } from "../utils/Airtable";
import Logger from "../utils/Logger";
import Mailer from "../helpers/Mailer";

import messages from "../languages/messages";

const logger = new Logger({ production: false });
const vMailer = new Mailer(messages.mails.titles.ACCOUNT_VALIDATED);
const dMailer = new Mailer(messages.mails.titles.ACCOUNT_DELETED);

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
		vMailer.send(user.email, messages.mails.messages.ACCOUNT_VALIDATED);

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
export const deleteUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params;
		if (!userId) return res.sendStatus(400);

		const user = await getUserById(userId);
		if (!user) return res.sendStatus(400);

		await deleteUserById(userId);
		dMailer.send(
			user.email,
			messages.mails.messages.ACCOUNT_DELETED_BY_ADMIN
		);

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
export const updateUserTags = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params;
		if (!userId) return res.sendStatus(400);

		const user = await getUserById(userId);
		if (!user) return res.sendStatus(400);

		const { tags } = req.body;
		if (!tags || tags.length <= 0) return res.sendStatus(400);

		for (let tag of tags) {
			if (!user.tags.find((t) => t.toLowerCase() == tag.toLowerCase())) {
				user.tags.push(tag);
			} else {
				user.tags.splice(user.tags.indexOf(tag), 1);
			}
		}

		await user.save();

		return res.status(200).send(user).end();
	} catch (error) {
		logger.log("ERROR", error);
		return res.sendStatus(500);
	}
};

export const updateUserFieldsOverride = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { userId } = req.params;
		if (!userId) return res.sendStatus(400);

		const user = await getUserById(userId);
		if (!user) return res.sendStatus(400);

		const { fields } = req.body;
		if (!fields || fields.length <= 0) return res.sendStatus(400);

		for (let fieldOverride of fields) {
			if (fieldOverride.fields.length > 0) {
				const result: { recordId: string; fields: string[] } = {
					recordId: fieldOverride.recordId,
					fields:
						user.fieldsOverride.find(
							(field) => field.recordId == fieldOverride.recordId
						)?.fields ?? [],
				};

				for (let field of fieldOverride.fields) {
					if (
						!user.fieldsOverride.find(
							(fo) =>
								fo.recordId == fieldOverride.recordId &&
								fo.fields.find(
									(f) =>
										f.toLowerCase() == field.toLowerCase()
								)
						)
					) {
						result.fields.push(field);
					} else {
						result.fields.splice(result.fields.indexOf(field), 1);
					}
				}

				if (
					user.fieldsOverride.find(
						(field) => field.recordId == fieldOverride.recordId
					)
				) {
					user.fieldsOverride.splice(
						user.fieldsOverride.indexOf(
							user.fieldsOverride.find(
								(field) =>
									field.recordId == fieldOverride.recordId
							)
						),
						1
					);
				}

				if (result.fields.length > 0) {
					user.fieldsOverride.push(result);
				}
			}
		}

		await user.save();

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

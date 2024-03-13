import express from "express";

import { isAuthenticated, isValidated, isAdmin } from "../middlewares";

import {
	validateUser,
	listRecords,
	deleteUser,
	updateUserTags,
	updateUserFieldsOverride,
} from "../controllers/admin";

export default (router: express.Router) => {
	router.get(
		"/admin/records",
		isAuthenticated,
		isValidated,
		isAdmin,
		listRecords
	);

	router.patch(
		"/admin/users/:userId/fieldsOverride",
		isAuthenticated,
		isValidated,
		isAdmin,
		updateUserFieldsOverride
	);

	router.patch(
		"/admin/users/:userId/tags",
		isAuthenticated,
		isValidated,
		isAdmin,
		updateUserTags
	);

	router.delete(
		"/admin/users/:userId",
		isAuthenticated,
		isValidated,
		isAdmin,
		deleteUser
	);

	router.post(
		"/admin/validate/:userId",
		isAuthenticated,
		isValidated,
		isAdmin,
		validateUser
	);
};

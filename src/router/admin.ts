import express from "express";

import { isAuthenticated, isValidated, isAdmin } from "../middlewares";

import { validateUser, listRecords } from "../controllers/admin";

export default (router: express.Router) => {
	router.get(
		"/admin/records",
		isAuthenticated,
		isValidated,
		isAdmin,
		listRecords
	);

	router.post(
		"/admin/validate/:userId",
		isAuthenticated,
		isValidated,
		isAdmin,
		validateUser
	);
};

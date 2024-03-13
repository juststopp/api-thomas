import express from "express";

import {
	getUser,
	deleteUser,
	updateUser,
	getRecords,
	likeRecord,
	getUserLikes,
} from "../controllers/users";
import { isAuthenticated, isValidated, isAccountOwner } from "../middlewares";

/**
 * User routes:
 *
 * GET /user/:userId : Get informations about the user matching the userId. User must be authenticated.
 *
 * GET /user/records : Get records that the user can access. User must be authenticated.
 *
 * PATH /users/:userId : Update the user matching the userId. User must be authenticated and must own the account.
 *
 * DELETE /users/:userId : Delete the user matching the userId. ser must be authenticated and must own the account.
 */

export default (router: express.Router) => {
	router.get("/user/records", isAuthenticated, isValidated, getRecords);
	router.get("/user/likes", isAuthenticated, isValidated, getUserLikes);

	router.get("/user/:userId", isAuthenticated, isValidated, getUser);

	router.patch("/user/likes", isAuthenticated, isValidated, likeRecord);

	router.patch(
		"/user",
		isAuthenticated,
		isValidated,
		isAccountOwner,
		updateUser
	);

	router.delete(
		"/user",
		isAuthenticated,
		isValidated,
		isAccountOwner,
		deleteUser
	);
};

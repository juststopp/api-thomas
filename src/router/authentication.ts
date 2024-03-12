import express from "express";

import { login, register } from "../controllers/authentication";

/**
 * Authentication routes:
 *
 * POST /auth/register : Register a User.
 * POST /auth/login : Login a user.
 */

export default (router: express.Router) => {
	router.post("/auth/register", register);
	router.post("/auth/login", login);
};

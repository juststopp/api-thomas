import express from "express";

import authentication from "./authentication";
import users from "./users";
import admin from "./admin";

const router = express.Router();

/**
 * Multiple routes for the different actions:
 *
 * Authentication: Everyting about user authentication, login and register ;
 * Users: Every routes used to manage the users ;
 */

/**
 * Default function to register the routes.
 * @returns {express.Router}: The router used accross the app.
 */

export default (): express.Router => {
	authentication(router);
	users(router);
	admin(router);
	return router;
};

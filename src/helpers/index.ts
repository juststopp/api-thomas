import crypto from "crypto";

/**
 * Generates a random string.
 *
 * @returns {string} A 128 bytes string converted to base64.
 */
export const random = () => crypto.randomBytes(128).toString("base64");

/**
 *
 * @param salt A random string generated with the random function.
 * @param password The password to be encrypted.
 * @returns {string} The encrypted password.
 */
export const authentication = (salt: string, password: string) => {
	return crypto
		.createHmac("sha256", [salt, password].join("/"))
		.update(process.env.API_SECRET)
		.digest("hex");
};

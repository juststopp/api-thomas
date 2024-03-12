import mongoose from "mongoose";

/**
 * The UserSchema for the MongoDB database.
 * Contains all informations needeed about the user.
 */

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },

	authentication: {
		password: { type: String, required: true, select: false },
		salt: { type: String, select: false },
		sessionToken: { type: String, select: false },
	},

	isAdmin: { type: Boolean, required: true, default: false },
	validated: { type: Boolean, required: true, default: false },

	tags: { type: [String], required: true, default: [] },
	likes: { type: [String], required: true, default: [] },
	fieldsOverride: [
		{
			recordId: { type: String, required: true },
			fields: { type: [String], required: true },
		},
	],
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = (starts: string) =>
	UserModel.find({ username: new RegExp("^" + starts) }).limit(20);

export const getUserByEmail = (email: String) => UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: String) =>
	UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserById = (id: String) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) =>
	new UserModel(values).save().then((user) => user.toObject());

export const updateUserById = (id: String, values: Record<string, any>) =>
	UserModel.findByIdAndUpdate(id, values);

export const deleteUserById = (id: String) =>
	UserModel.findByIdAndDelete({ _id: id });

export const getTags = (id: string) =>
	UserModel.findById(id).then((user) => user.tags);

export const getLikes = (id: string) =>
	UserModel.findById(id).then((user) => user.likes);

export const getFieldsOverride = (id: string) =>
	UserModel.findById(id).then((user) => user.fieldsOverride);

export const usersListener = UserModel.watch();

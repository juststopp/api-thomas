import { getTags, getFieldsOverride } from "../db/Users";
import Logger from "../utils/Logger";

const logger = new Logger({ production: false });

export const getRecords = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(
				"https://api.airtable.com/v0/" +
					process.env.AIRTABLE_BASE_ID +
					"/" +
					process.env.AIRTABLE_TABLE_ID,
				{
					method: "GET",
					headers: {
						Authorization:
							"Bearer " + process.env.AIRTABLE_API_TOKEN,
					},
				}
			);

			resolve(response.json());
		} catch (error) {
			logger.log("ERROR", error);
			reject(error);
		}
	});
};

export const getUserRecords = (userId: string) => {
	return new Promise(async (resolve, reject) => {
		try {
			const records: any = await getRecords();
			const userTags = await getTags(userId);
			const fieldsOverride = await getFieldsOverride(userId);

			const userAccessRecords = new Array();
			records["records"].forEach((record: any) => {
				const recordFields: { [key: string]: any } = {};

				if (
					userTags.find(
						(userTag: string) =>
							userTag.toLowerCase() ==
							record.fields[
								process.env.AIRTABLE_TAG_FIELD
							].toLowerCase()
					)
				) {
					for (let [key, value] of Object.entries(record.fields)) {
						if (
							process.env.AIRTABLE_DEFAULT_FIELDS.split(
								", "
							).find(
								(field: string) =>
									field.toLowerCase() == key.toLowerCase()
							)
						) {
							recordFields[key] = value;
						}
					}
				}

				if (
					fieldsOverride.find(
						(fieldOverride: any) =>
							fieldOverride.recordId == record["id"]
					)
				) {
					for (let [key, value] of Object.entries(record["fields"])) {
						if (
							fieldsOverride.find((fieldOverride: any) =>
								fieldOverride.fields.find(
									(f: string) =>
										f.toLowerCase() == key.toLowerCase()
								)
							)
						) {
							recordFields[key] = value;
						}
					}
				}

				if (Object.keys(recordFields).length > 0) {
					recordFields["id"] = record["id"];
					userAccessRecords.push(recordFields);
				}
			});

			resolve(userAccessRecords);
		} catch (error) {
			logger.log("ERROR", error);
			reject(error);
		}
	});
};

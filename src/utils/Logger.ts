type LoggerType = "DEBUG" | "SUCCESS" | "INFO" | "WARN" | "ERROR" | "FATAL";

class Logger {
	production: boolean = false;

	constructor({ production }: { production: boolean }) {
		this.production = production;
	}

	log(type: LoggerType, message: string | Error) {
		let color = null;
		let error = false;

		const startingColor = "\x1b[";

		if (type === "DEBUG") {
			if (this.production) return;
			color = `${startingColor}95mDEBUG${startingColor}0m  `;
		}
		if (type === "SUCCESS")
			color = `${startingColor}92mSUCCESS${startingColor}0m`;
		if (type === "INFO")
			color = `${startingColor}94mINFO${startingColor}0m   `;
		if (type === "WARN")
			color = `${startingColor}93mWARN${startingColor}0m   `;
		if (type === "ERROR") {
			color = `${startingColor}91mERROR${startingColor}0m  `;
			error = true;
		}
		if (type === "FATAL") {
			color = `${startingColor}101mFATAL${startingColor}0m  `;
			error = true;
		}

		const r = new Error().stack.split("\n")[3].split("(")[1].split(")")[0];
		const d = new Date();
		const p = `${startingColor}2m[${d
			.toISOString()
			.replace(/T/, " ")
			.replace(
				/Z/,
				""
			)}]${startingColor}0m ${color} ${startingColor}2m${startingColor}0m ${message}\n`;

		if (error) process.stderr.write(p);
		else process.stdout.write(p);
	}
}

export default Logger;

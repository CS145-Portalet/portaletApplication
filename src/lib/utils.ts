export function numberToUTC(timestamp: number, isSeconds = false): string {
		const ms = isSeconds ? timestamp * 1000 : timestamp;
		const date = new Date(ms);
		return date.toUTCString();
	}
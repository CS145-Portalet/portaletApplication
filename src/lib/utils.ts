export function numberToUTC(timestamp: number, isSeconds = false): string {
	const ms = isSeconds ? timestamp * 1000 : timestamp;
	const date = new Date(ms);
	return date.toLocaleString();
}

export function numberToDate(timestamp: number, isSeconds = false): string {
	const ms = isSeconds ? timestamp * 1000 : timestamp;
	const date = new Date(ms).toLocaleDateString();
	return date;
}

export function numberToTime(timestamp: number, isSeconds = false): string {
	const ms = isSeconds ? timestamp * 1000 : timestamp;
	const date = new Date(ms).toLocaleTimeString();
	return date;
}

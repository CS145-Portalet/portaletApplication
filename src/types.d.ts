export type device = {
	device_id: string;
	city: string;
	created_at: number;
	nickname: string;
	street_address: string;
	latest_status: number;
};

export type deviceLog = {
	log_id: string;
	status_int: number;
	created_at: number;
};

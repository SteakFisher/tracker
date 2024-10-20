class APIErrors {
	public static DB_ERROR(error: any) {
		console.error(error);
		return {
			success: false,
			message: "DB_ERROR",
			error: error,
		};
	}

	public static INVALID_REQUEST_BODY(error: any) {
		console.error(error);
		return {
			success: false,
			message: "INVALID_REQUEST_BODY",
			error: error,
		};
	}

	public static UNAUTHORIZED(error: any) {
		console.error(error);
		return {
			success: false,
			message: "UNAUTHORIZED",
			error: error,
		};
	}

	public static GENERIC(error: any) {
		console.error(error);
		return {
			success: false,
			message: "GENERIC",
			error: error,
		};
	}
}

export const toRadians = (degrees: number): number => {
	return degrees * (Math.PI / 180);
};
export const toDegrees = (radians: number): number => {
	return radians * (180 / Math.PI);
};

export const normalizeDegrees = (degrees: number): number => {
	degrees = degrees % 360;
	if (degrees < 0) {
		degrees += 360;
	}
	return degrees;
};

export const normalizeRadians = (radians: number): number => {
	radians = radians % (2 * Math.PI);
	if (radians < 0) {
		radians += 2 * Math.PI;
	}
	return radians;
};
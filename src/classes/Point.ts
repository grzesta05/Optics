/**
 * A point in 2D space.
 */
class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Rotates a point around a center point by a given angle - **in place**.
	 * @param center - The center point to rotate around
	 * @param angle - The angle to rotate by, in degrees
	 */
	rotate(center: Point, angle: number): Point {
		const radians = angle * Math.PI / 180;
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
		const x = this.x - center.x;
		const y = this.y - center.y;
		this.x = center.x + x * cos - y * sin;
		this.y = center.y + x * sin + y * cos;

		return this;
	}
}

export default Point;
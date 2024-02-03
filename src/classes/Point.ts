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

	/**
	 * Returns the distance between this point and another point.
	 * @param other - The other point
	 */
	distanceTo(other: Point): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * Adds another point to this point - **in place**.
	 * @param other - The other point
	 */
	add(other: Point): Point {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	clone(): Point {
		return new Point(this.x, this.y);
	}
}

export default Point;
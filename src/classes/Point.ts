import { toRadians } from "@/utils/algebra.ts";

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
	 * @param degrees - The angle to rotate by, in degrees
	 */
	rotate(degrees: number, center: Point = new Point(0, 0)): Point {
		const radians = toRadians(degrees);
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

	/**
	 * Subtracts another point from this point - **in place**.
	 * @param other - The other point
	 */
	subtract(other: Point): Point {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	clone(): Point {
		return new Point(this.x, this.y);
	}

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}

	static midpoint(a: Point, b: Point): Point {
		return new Point((a.x + b.x) / 2, (a.y + b.y) / 2);
	}
}

export default Point;
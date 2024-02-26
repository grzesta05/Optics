import Point from "@/classes/Point.ts";
import { toRadians } from "@/utils/algebra.ts";

/**
 * A rectangle defined by its four corners.
 */
class Rectangle {
	topLeft: Point;
	topRight: Point;
	bottomRight: Point;
	bottomLeft: Point;

	/**
	 * Rotation of the rectangle in radians.
	 */
	rotation: number = 0;

	minX: number = 0;
	maxX: number = 0;
	minY: number = 0;
	maxY: number = 0;

	constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
		this.topLeft = topLeft;
		this.topRight = topRight;
		this.bottomRight = bottomRight;
		this.bottomLeft = bottomLeft;
		this.rotation = 0;

		this._recalculateMinMax();
	}

	_recalculateMinMax() {
		this.minX = Math.min(this.topLeft.x, this.topRight.x, this.bottomRight.x, this.bottomLeft.x);
		this.maxX = Math.max(this.topLeft.x, this.topRight.x, this.bottomRight.x, this.bottomLeft.x);
		this.minY = Math.min(this.topLeft.y, this.topRight.y, this.bottomRight.y, this.bottomLeft.y);
		this.maxY = Math.max(this.topLeft.y, this.topRight.y, this.bottomRight.y, this.bottomLeft.y);
	}

	center(): Point {
		return new Point(
			(this.topLeft.x + this.topRight.x + this.bottomRight.x + this.bottomLeft.x) / 4,
			(this.topLeft.y + this.topRight.y + this.bottomRight.y + this.bottomLeft.y) / 4
		);
	}

	points(): Point[] {
		return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
	}

	sizeX(): number {
		return this.topLeft.distanceTo(this.topRight);
	}

	sizeY(): number {
		return this.topLeft.distanceTo(this.bottomLeft);
	}

	/**
	 * Rotates a rectangle around a center point by a given angle - **in place**.
	 * @param center - The center point to rotate around
	 * @param degrees - The angle to rotate by, in degrees
	 */
	rotate(center: Point, degrees: number): Rectangle {
		this.topLeft.rotate(degrees, center);
		this.topRight.rotate(degrees, center);
		this.bottomRight.rotate(degrees, center);
		this.bottomLeft.rotate(degrees, center);

		this.rotation += toRadians(degrees);
		this._recalculateMinMax();

		return this;
	}

	area(): number {
		return this.sizeX() * this.sizeY();
	}

	moveBy(delta: Point): Rectangle {
		this.topLeft = this.topLeft.add(delta);
		this.topRight = this.topRight.add(delta);
		this.bottomRight = this.bottomRight.add(delta);
		this.bottomLeft = this.bottomLeft.add(delta);
		this._recalculateMinMax();

		return this;
	}

	intersectsOrContains(other: Rectangle): boolean {
		return (
			this.contains(other.topLeft) ||
			this.contains(other.topRight) ||
			this.contains(other.bottomRight) ||
			this.contains(other.bottomLeft) ||
			other.contains(this.topLeft) ||
			other.contains(this.topRight) ||
			other.contains(this.bottomRight) ||
			other.contains(this.bottomLeft)
		);
	}

	/**
	 * Checks if a point is inside the rectangle.
	 * @param point - The point to check
	 * @returns True if the point is inside the rectangle, false otherwise
	 */
	contains(point: Point): boolean {
		const sign = (p1: Point, p2: Point, p3: Point): number => {
			return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
		};

		const b1 = sign(point, this.topLeft, this.topRight) < 0;
		const b2 = sign(point, this.topRight, this.bottomRight) < 0;
		const b3 = sign(point, this.bottomRight, this.bottomLeft) < 0;
		const b4 = sign(point, this.bottomLeft, this.topLeft) < 0;

		return (b1 === b2) && (b2 === b3) && (b3 === b4);
	}

	static fromTopLeftAndSize(topLeft: Point, sizeX: number, sizeY: number, degrees: number = 0): Rectangle {
		const rect = new Rectangle(
			topLeft,
			new Point(topLeft.x + sizeX, topLeft.y),
			new Point(topLeft.x + sizeX, topLeft.y + sizeY),
			new Point(topLeft.x, topLeft.y + sizeY)
		);

		rect.rotate(new Point(topLeft.x + sizeX / 2, topLeft.y + sizeY / 2), degrees);

		return rect;
	}
}

export default Rectangle;

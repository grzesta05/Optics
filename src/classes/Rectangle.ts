import Point from "@/classes/Point.ts";

/**
 * A rectangle defined by its four corners.
 */
class Rectangle {
	topLeft: Point;
	topRight: Point;
	bottomRight: Point;
	bottomLeft: Point;

	rotation: number = 0;

	constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
		this.topLeft = topLeft;
		this.topRight = topRight;
		this.bottomRight = bottomRight;
		this.bottomLeft = bottomLeft;
		this.rotation = 0;
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
	 * @param angle - The angle to rotate by, in degrees
	 */
	rotate(center: Point, angle: number): Rectangle {
		this.topLeft.rotate(center, angle);
		this.topRight.rotate(center, angle);
		this.bottomRight.rotate(center, angle);
		this.bottomLeft.rotate(center, angle);

		this.rotation += angle;

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
		const crossProduct = (p1: Point, p2: Point, p3: Point) => {
			return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
		};

		const isInside = (p: Point, p1: Point, p2: Point, p3: Point, p4: Point) => {
			return (
				crossProduct(p, p1, p2) >= 0 &&
				crossProduct(p, p2, p3) >= 0 &&
				crossProduct(p, p3, p4) >= 0 &&
				crossProduct(p, p4, p1) >= 0
			);
		};

		return isInside(point, this.topLeft, this.topRight, this.bottomRight, this.bottomLeft);
	}

	static fromTopLeftAndSize(topLeft: Point, sizeX: number, sizeY: number, rotation: number = 0): Rectangle {
		const rect = new Rectangle(
			topLeft,
			new Point(topLeft.x + sizeX, topLeft.y),
			new Point(topLeft.x + sizeX, topLeft.y + sizeY),
			new Point(topLeft.x, topLeft.y + sizeY)
		);

		rect.rotate(new Point(topLeft.x + sizeX / 2, topLeft.y + sizeY / 2), rotation);

		return rect;
	}
}

export default Rectangle;

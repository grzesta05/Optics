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

	_minX: number = 0;
	_maxX: number = 0;
	_minY: number = 0;
	_maxY: number = 0;

	constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
		this.topLeft = topLeft;
		this.topRight = topRight;
		this.bottomRight = bottomRight;
		this.bottomLeft = bottomLeft;
		this.rotation = 0;

		this._recalculateMinMax();
	}

	_recalculateMinMax() {
		this._minX = Math.min(this.topLeft.x, this.topRight.x, this.bottomRight.x, this.bottomLeft.x);
		this._maxX = Math.max(this.topLeft.x, this.topRight.x, this.bottomRight.x, this.bottomLeft.x);
		this._minY = Math.min(this.topLeft.y, this.topRight.y, this.bottomRight.y, this.bottomLeft.y);
		this._maxY = Math.max(this.topLeft.y, this.topRight.y, this.bottomRight.y, this.bottomLeft.y);
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
		this._recalculateMinMax();

		return this;
	}

	area(): number {
		return this.sizeX() * this.sizeY();
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

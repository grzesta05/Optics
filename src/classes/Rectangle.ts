import Point from "@/classes/Point.ts";

/**
 * A rectangle defined by its four corners.
 */
class Rectangle {
	topLeft: Point;
	topRight: Point;
	bottomRight: Point;
	bottomLeft: Point;

	constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
		this.topLeft = topLeft;
		this.topRight = topRight;
		this.bottomRight = bottomRight;
		this.bottomLeft = bottomLeft;
	}

	points(): Point[] {
		return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
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

		return this;
	}
}

export default Rectangle;

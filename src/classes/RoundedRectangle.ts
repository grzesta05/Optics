import Point from "@/classes/Point.ts";
import { toRadians } from "@/utils/algebra.ts";
import Rectangle from "./Rectangle";

/**
 * A rectangle defined by its four corners.
 */
class RoundedRectangle extends Rectangle {
	centerRight: Point;
	centerLeft: Point;

	isRightDomed: boolean = true;
	isLeftDomed: boolean = true;
	roundByPercentage(percent: number) {
		if (percent > 100 || percent < 0) return;
	}
	rotate(center: Point, degrees: number): RoundedRectangle {
		super.rotate(center, degrees);
		this.centerRight.rotate(degrees, center);
		this.centerLeft.rotate(degrees, center);

		return this;
	}
	moveBy(delta: Point): RoundedRectangle {
		super.moveBy(delta);
		this.centerRight = this.centerRight.add(delta);
		this.centerLeft = this.centerLeft.add(delta);

		return this;
	}

	constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
		super(topLeft, topRight, bottomRight, bottomLeft);
		this.centerRight = new Point((topRight.x + bottomRight.x) / 2, (topRight.y + bottomRight.x) / 2);
		this.centerLeft = new Point((topLeft.x + bottomLeft.x) / 2, (topLeft.y + bottomLeft.x) / 2);
	}
	static fromTopLeftAndSize(topLeft: Point, sizeX: number, sizeY: number, degrees?: number): RoundedRectangle {
		return super.fromTopLeftAndSize(topLeft, sizeX, sizeY, degrees) as RoundedRectangle;
	}
}

export default RoundedRectangle;

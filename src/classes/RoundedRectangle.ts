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

	rightRadius: number;
	leftRadius: number;

	radiusCircleCentersLeft: object;
	radiusCircleCentersRight: object;

	getCurrentRadiusPoints() {
		return {
			//@ts-ignore
			right: this.isRightDomed ? this.radiusCircleCentersRight.domed : this.radiusCircleCentersRight.concave,
			//@ts-ignore
			left: this.isLeftDomed ? this.radiusCircleCentersLeft.domed : this.radiusCircleCentersLeft.concave,
		};
	}
	domeAngles() {
		let right,
			left = 0;
		const h = this.topLeft.distanceTo(this.topRight);
		//Is domed or concave

		right = 2 * Math.asin(h / (this.rightRadius * 2));
		left = 2 * Math.asin(h / (this.leftRadius * 2));
		return { right, left };
	}

	roundByPercentage(percentLeft: number, percentRight: number) {
		if (!(percentRight > 100 || percentRight < 0)) {
			const multiplier = this.isRightDomed ? 1 : -1;
			this.centerRight = this.centerRight.add(
				new Point((percentRight / 100) * this.topLeft.distanceTo(this.topRight) * multiplier, 0)
			);
		}
		if (!(percentLeft > 100 || percentLeft < 0)) {
			const multiplier = this.isLeftDomed ? -1 : 1;
			this.centerLeft = this.centerLeft.add(
				new Point((percentLeft / 100) * this.topLeft.distanceTo(this.topRight) * multiplier, 0)
			);
		}
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
		this.centerRight = new Point((topRight.x + bottomRight.x) / 2, (topRight.y + bottomRight.y) / 2);
		this.centerLeft = new Point((topLeft.x + bottomLeft.x) / 2, (topLeft.y + bottomLeft.y) / 2);

		const width = topLeft.distanceTo(topRight);
		this.radiusCircleCentersLeft = {
			domed: new Point(this.centerLeft.add(new Point(width / 2, 0)).x, this.centerLeft.y),
			concave: new Point(this.centerLeft.add(new Point(-width / 2, 0)).x, this.centerLeft.y),
		};
		this.radiusCircleCentersRight = {
			domed: new Point(this.centerRight.add(new Point(-width / 2, 0)).x, this.centerRight.y),
			concave: new Point(this.centerRight.add(new Point(width / 2, 0)).x, this.centerRight.y),
		};

		this.leftRadius = width / 2;
		this.rightRadius = width / 2;
	}
	static fromTopLeftAndSize(topLeft: Point, sizeX: number, sizeY: number, degrees?: number): RoundedRectangle {
		const rect = super.fromTopLeftAndSize(topLeft, sizeX, sizeY, degrees) as RoundedRectangle;

		return {
			...new RoundedRectangle(rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft),
			...rect,
		} as RoundedRectangle;
	}
}

export default RoundedRectangle;

//@ts-nocheck
import Point from "@/classes/Point.ts";
import { toRadians } from "@/utils/algebra.ts";
import Rectangle from "./Rectangle";

/**
 * A rectangle defined by its four corners.
 */
class RoundedRectangle extends Rectangle {
	centerRight: Point;
	centerLeft: Point;

	isRightDomed: boolean = false;
	isLeftDomed: boolean = true;

	rightRadius: number;
	leftRadius: number;

	radiusCircleCentersLeft: object;
	radiusCircleCentersRight: object;

	getCurrentRadiusPoints() {
		const deltaLeft = this.centerLeft.distanceTo(
			new Point(this.radiusCircleCentersLeft.domed.x - this.leftRadius, this.centerLeft.y)
		);
		const deltaRight = this.centerRight.distanceTo(
			new Point(this.radiusCircleCentersRight.domed.x - this.rightRadius, this.centerRight.y)
		);
		console.log(deltaLeft);
		return {
			//@ts-ignore
			right: this.isRightDomed
				? new Point(this.centerRight.x - deltaRight, this.radiusCircleCentersRight.domed.y)
				: new Point(
						this.radiusCircleCentersRight.concave.x + deltaRight,
						this.radiusCircleCentersRight.concave.y
				  ),
			//@ts-ignore
			left: this.isLeftDomed
				? new Point(this.radiusCircleCentersLeft.domed.x + deltaLeft, this.radiusCircleCentersLeft.domed.y)
				: new Point(this.radiusCircleCentersLeft.concave.x - deltaLeft, this.radiusCircleCentersLeft.concave.y),
		};
	}
	domeAngles() {
		let right,
			left = 0;
		const h = this.topLeft.distanceTo(this.topRight);
		//Is domed or concave

		right = 2 * Math.asin(Math.min(Math.max(h / (this.rightRadius * 2), -1), 1));
		left = 2 * Math.asin(Math.min(Math.max(h / (this.leftRadius * 2), -1), 1));

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
		this.radiusCircleCentersLeft.domed.rotate(degrees, center);
		this.radiusCircleCentersLeft.concave.rotate(degrees, center);
		this.radiusCircleCentersRight.domed.rotate(degrees, center);
		this.radiusCircleCentersRight.concave.rotate(degrees, center);
		return this;
	}
	moveBy(delta: Point): RoundedRectangle {
		super.moveBy(delta);
		this.centerRight = this.centerRight.add(delta);
		this.centerLeft = this.centerLeft.add(delta);
		this.radiusCircleCentersLeft.domed.add(delta);
		this.radiusCircleCentersLeft.concave.add(delta);
		this.radiusCircleCentersRight.domed.add(delta);
		this.radiusCircleCentersRight.concave.add(delta);
		return this;
	}

	constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point) {
		super(topLeft, topRight, bottomRight, bottomLeft);
		this.centerRight = new Point((topRight.x + bottomRight.x) / 2, (topRight.y + bottomRight.y) / 2);
		this.centerLeft = new Point((topLeft.x + bottomLeft.x) / 2, (topLeft.y + bottomLeft.y) / 2);

		const width = topLeft.distanceTo(topRight);
		this.radiusCircleCentersLeft = {
			domed: new Point(this.centerLeft.x, this.centerLeft.y),
			concave: new Point(this.centerLeft.x, this.centerLeft.y),
		};
		this.radiusCircleCentersRight = {
			domed: new Point(this.centerRight.x, this.centerRight.y),
			concave: new Point(this.centerRight.x, this.centerRight.y),
		};

		this.leftRadius = width / 1.5;
		this.rightRadius = width / 1;
	}
	static fromTopLeftAndSize(topLeft: Point, sizeX: number, sizeY: number, degrees?: number): RoundedRectangle {
		const rect = super.fromTopLeftAndSize(topLeft, sizeX, sizeY, degrees) as RoundedRectangle;

		return new RoundedRectangle(rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft);
	}
}

export default RoundedRectangle;

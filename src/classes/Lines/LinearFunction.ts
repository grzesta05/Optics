import Point from "@/classes/Point.ts";
import { toDegrees, toRadians } from "@/utils/algebra.ts";

export enum Direction {
	Right = -1,
	Left = 1
}

export class LinearFunction {
	public a: number;
	public b: number;

	public lowerLimit: number = -Infinity;
	public upperLimit: number = Infinity;

	public direction: Direction;

	public color: string = "#FF0000";
	public intensity: number = 1;

	private _hasIntersectionsCalculated: boolean = false;

	public get hasIntersectionsCalculated(): boolean {
		return this._hasIntersectionsCalculated;
	}

	constructor(a: number, b: number, direction: Direction = Direction.Left) {
		this.a = a;
		this.b = b;
		this.direction = direction;
	}

	public calculateIntersections(others: LinearFunction[]): void {
		for (const other of others) {
			this.calculateIntersectionWith(other);
		}
		this._hasIntersectionsCalculated = true;
	}

	private calculateIntersectionWith(other: LinearFunction): void {
		const intersection = this.intersectionWith(other);
		if (intersection) {
			if (this.isWithinLimits(intersection.x)) {
				console.log(intersection.x, this.lowerLimit, this.upperLimit, this.direction);
				if (this.direction === Direction.Left) {
					this.upperLimit = Math.min(this.upperLimit, intersection.x);
				} else {
					this.lowerLimit = Math.max(this.lowerLimit, intersection.x);
				}
			}
		}
	}

	/**
	 * Set the limits of the function - in place
	 * @param lower - the lower limit
	 * @param upper - the upper limit
	 * @returns the function
	 */
	public limit(lower: number, upper: number) {
		if (lower > upper) {
			this.lowerLimit = upper;
			this.upperLimit = lower;
			return this;
		}

		this.lowerLimit = lower;
		this.upperLimit = upper;
		return this;
	}

	public isWithinLimits(x: number): boolean {
		return x >= this.lowerLimit && x <= this.upperLimit;
	}

	public at(x: number): number {
		return this.a * x + this.b;
	}

	public intersectionWith(other: LinearFunction): Point | null {
		if (this.a === other.a) {
			return null;
		}

		const x = (other.b - this.b) / (this.a - other.a);
		const y = this.at(x);

		if (this.isWithinLimits(x) && other.isWithinLimits(x)) {
			return new Point(x, y);
		} else {
			return null;
		}
	}

	static fromPointAndAngle(point: Point, radians: number): LinearFunction {
		// we invert the angle because the y-axis is inverted in the canvas
		let degrees = toDegrees(radians);
		if (degrees === 90) {
			degrees -= 0.0001;
		} else if (degrees === 270) {
			degrees += 0.0001;
		}

		const a = Math.tan(toRadians(degrees));
		const b = point.y - a * point.x;
		let direction = Direction.Left;
		if (degrees > 90 && degrees < 270) {
			direction = Direction.Right;
		}

		return new LinearFunction(a, b, direction);
	}

	static fromTwoPoints(p1: Point, p2: Point, direction: Direction = Direction.Left): LinearFunction {
		if(p1.x === p2.x) {
			p1.x += 0.0001;
		}

		const a = (p2.y - p1.y) / (p2.x - p1.x);
		const b = p1.y - a * p1.x;
		return new LinearFunction(a, b, direction);
	}
}
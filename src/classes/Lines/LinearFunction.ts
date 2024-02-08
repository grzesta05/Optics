import Point from "@/classes/Point.ts";
import { normalizeRadians, toDegrees } from "@/utils/algebra.ts";

export enum Direction {
	Right = 1,
	Left = -1
}

export const getDirection = (radians: number) => {
	let degrees = toDegrees(normalizeRadians(radians));
	if (degrees === 90) {
		degrees -= 0.0001;
	} else if (degrees === 270) {
		degrees += 0.0001;
	}
	if (degrees > 90 && degrees < 270) {
		return Direction.Left;
	}
	return Direction.Right;
};

export class LinearFunction {
	public a: number;
	public b: number;

	public lowerLimit: number = -Infinity;
	public upperLimit: number = Infinity;

	public direction: Direction;

	constructor(a: number, b: number, direction: Direction = Direction.Left) {
		this.a = a;
		this.b = b;
		this.direction = direction;
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

	public angleBetween(other: LinearFunction): number {
		let rad = Math.atan((other.a - this.a) / (1 + this.a * other.a));
		if (rad < 0) {
			rad += Math.PI;
		}
		return rad;
	}
}
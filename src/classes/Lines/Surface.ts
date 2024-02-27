import { Direction, LinearFunction } from "@/classes/Lines/LinearFunction.ts";
import Point from "@/classes/Point.ts";
import { calculateLinearFromPointAndAngle } from "@/utils/geometry.ts";

export class Surface extends LinearFunction {
	public reflectivity: number = 1;
	public ltrRefractiveIndex: number = 1;

	public get rtlRefractiveIndex(): number {
		return 1 / this.ltrRefractiveIndex;
	}

	public get pernatrability(): number {
		return 1 - this.reflectivity;
	}

	constructor(a: number, b: number, reflectivity: number = 1) {
		super(a, b);
		this.reflectivity = reflectivity;
	}

	center(): Point {
		const midX = (this.lowerLimit + this.upperLimit) / 2;
		const midY = this.at(midX);
		return new Point(midX, midY);
	}

	static fromPointAndAngle(point: Point, radians: number): Surface {
		const {a, b} = calculateLinearFromPointAndAngle(point, radians);
		return new Surface(a, b);
	}

	static fromTwoPoints(p1: Point, p2: Point, direction: Direction = Direction.Left): Surface {
		if (p1.x === p2.x) {
			p1.x += 0.0001;
		}

		const a = (p2.y - p1.y) / (p2.x - p1.x);
		const b = p1.y - a * p1.x;
		return new Surface(a, b, direction);
	}

}
import { Direction, LinearFunction } from "@/classes/Lines/LinearFunction.ts";
import Point from "@/classes/Point.ts";
import { calculateLinearFromPointAndAngle } from "@/utils/geometry.ts";

export class Surface extends LinearFunction {
	public reflectivity: number = 1;
	public glossiness: number = 1;

	constructor(a: number, b: number, reflectivity: number = 1, glossiness: number = 1) {
		super(a, b);
		this.reflectivity = reflectivity;
		this.glossiness = glossiness;
	}

	static fromPointAndAngle(point: Point, radians: number): Surface {
		const {a, b, direction} = calculateLinearFromPointAndAngle(point, radians);
		return new Surface(a, b, direction);
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
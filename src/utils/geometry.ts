import Rectangle from "@/classes/Rectangle.ts";
import { Surface } from "@/classes/Lines/Surface.ts";
import Point from "@/classes/Point.ts";
import { Direction } from "@/classes/Lines/LinearFunction.ts";
import { toDegrees, toRadians } from "@/utils/algebra.ts";

export const getAllSurfaces: (rects: Rectangle[]) => Surface[] = (rects) => {
	return rects.reduce((acc: Surface[], rect) => acc.concat(getRectangleSurfaces(rect)), []);
};

export const getRectangleSurfaces: (rect: Rectangle) => Surface[] = (rect) => {
	return [
		Surface.fromTwoPoints(rect.topLeft, rect.topRight).limit(rect.topLeft.x, rect.topRight.x),
		Surface.fromTwoPoints(rect.topRight, rect.bottomRight).limit(rect.topRight.x, rect.bottomRight.x),
		Surface.fromTwoPoints(rect.bottomRight, rect.bottomLeft).limit(rect.bottomRight.x, rect.bottomLeft.x),
		Surface.fromTwoPoints(rect.bottomLeft, rect.topLeft).limit(rect.bottomLeft.x, rect.topLeft.x)
	];
};

export const calculateLinearFromPointAndAngle = (point: Point, radians: number) => {
	// we invert the angle because the y-axis is inverted in the canvas
	let degrees = toDegrees(radians);
	if (degrees === 90) {
		degrees -= 0.0001;
	} else if (degrees === 270) {
		degrees += 0.0001;
	}

	const a = Math.tan(toRadians(degrees));
	const b = point.y - a * point.x;
	let direction = Direction.Right;
	if (degrees > 90 && degrees < 270) {
		direction = Direction.Left;
	}

	return {a, b, direction};
};
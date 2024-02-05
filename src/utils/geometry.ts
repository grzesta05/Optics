import Rectangle from "@/classes/Rectangle.ts";
import { LinearFunction } from "@/classes/Lines/LinearFunction.ts";

export const getAllLinearFunctions: (rects: Rectangle[]) => LinearFunction[] = (rects) => {
	return rects.reduce((acc: LinearFunction[], rect) => acc.concat(getRectangleLinearFunctions(rect)), []);
};

export const getRectangleLinearFunctions: (rect: Rectangle) => LinearFunction[] = (rect) => {
	return [
		LinearFunction.fromTwoPoints(rect.topLeft, rect.topRight).limit(rect.topLeft.x, rect.topRight.x),
		LinearFunction.fromTwoPoints(rect.topRight, rect.bottomRight).limit(rect.topRight.x, rect.bottomRight.x),
		LinearFunction.fromTwoPoints(rect.bottomRight, rect.bottomLeft).limit(rect.bottomRight.x, rect.bottomLeft.x),
		LinearFunction.fromTwoPoints(rect.bottomLeft, rect.topLeft).limit(rect.bottomLeft.x, rect.topLeft.x)
	];
};
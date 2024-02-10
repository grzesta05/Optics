import Point from "@/classes/Point.ts";

export const positionToCanvas = (x: number, y: number, offset: Point, sizeMultiplier: number): [number, number] => {
	return [
		(x - offset.x) * sizeMultiplier,
		(y + offset.y) * sizeMultiplier
	];
};
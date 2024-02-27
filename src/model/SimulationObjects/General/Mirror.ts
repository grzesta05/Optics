import SimulationObject from "@/model/SimulationObject.ts";
import Point from "@/classes/Point.ts";
import { normalizeDegrees } from "@/utils/algebra.ts";
import Rectangle from "@/classes/Rectangle.ts";

export default class Mirror extends SimulationObject {
	public static imagePath = "/img/mirror.png";
	public size: number = 100;

	constructor(x: number, y: number, degrees: number) {
		degrees = normalizeDegrees(degrees);
		const rect = Rectangle.fromTopLeftAndSize(new Point(x, y), 100, 2, degrees);
		rect.reflectivity = 1;
		super(rect, "");
	}

	draw(offset: Point, sizeMultiplier: number): void {
		this.drawBounds(offset, sizeMultiplier);
	}
}
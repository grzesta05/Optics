import SimulationObject from "@/model/SimulationObject.ts";
import Point from "@/classes/Point.ts";
import { normalizeDegrees } from "@/utils/algebra.ts";
import Rectangle from "@/classes/Rectangle.ts";

export default class Prism extends SimulationObject {
	public static imagePath = "/img/mirror.png";

	constructor(x: number, y: number, degrees: number) {
		degrees = normalizeDegrees(degrees);
		const rect = Rectangle.fromTopLeftAndSize(new Point(x, y), 100, 100, degrees);
		rect.topLeft = new Point(rect.topLeft.x + rect.topRight.x / 2, rect.topLeft.y);
		rect.topRight = new Point(rect.topLeft.x + 1, rect.topLeft.y);
		super(rect, "");
	}

	draw(offset: Point, sizeMultiplier: number): void {
		this.drawBounds(offset, sizeMultiplier);
	}
}

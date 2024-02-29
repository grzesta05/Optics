import SimulationObject from "@/model/SimulationObject.ts";
import Point from "@/classes/Point.ts";
import { normalizeDegrees } from "@/utils/algebra.ts";
import Rectangle from "@/classes/Rectangle.ts";

export default class Prism extends SimulationObject {
	public static imagePath = "https://cdn-icons-png.flaticon.com/512/519/519499.png";
	public size: number = 100;

	constructor(x: number, y: number, degrees: number) {
		degrees = normalizeDegrees(degrees);
		const rect: Rectangle = Rectangle.fromTopLeftAndSize(new Point(x, y), 100, 100, degrees);
		const avg = (rect.topLeft.x + rect.topRight.x) / 2;
		rect.topRight = new Point(avg + 1, rect.topRight.y);
		rect.topLeft = new Point(avg, rect.topLeft.y);
		super(rect, "");
	}

	draw(offset: Point, sizeMultiplier: number): void {
		this.drawBounds(offset, sizeMultiplier);
	}
}

import SimulationObject from "@/model/SimulationObject";
import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";

export default class DebugRectangle extends SimulationObject {
	constructor(x: number, y: number, width: number, height: number, rotation: number = 0) {
		const rect = Rectangle.fromTopLeftAndSize(new Point(x, y), width, height, rotation);

		super(rect, "/img/laser.png");
	}
}

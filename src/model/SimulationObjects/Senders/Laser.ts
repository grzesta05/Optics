import SimulationObject from "@/model/SimulationObject";
import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";

export default class Laser extends SimulationObject {
	constructor(x: number, y: number) {
		const rect = Rectangle.fromTopLeftAndSize(new Point(x, y), 300, 100, 34);

		super(rect, "/img/laser.png");
		console.log("Created new Laser with bounds");
	}
}

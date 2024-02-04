import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";
import Sender from "@/model/SimulationObjects/Sender.ts";
import { LinearFunction } from "@/classes/LinearFunction.ts";

export default class Laser extends Sender {
	constructor(x: number, y: number, rotation: number) {
		const rect = Rectangle.fromTopLeftAndSize(new Point(x, y), 100, 100, rotation);

		const startPoint = Point.midpoint(rect.topRight, rect.bottomRight).add(new Point(1, 0).rotate(rect.rotation));

		const laser = LinearFunction.fromPointAndAngle(startPoint, rect.rotation);
		laser.intensity = 0.5;

		let centerX = startPoint.x;
		if (rotation % 360 > 90 && rotation % 360 < 270) {
			laser.upperLimit = centerX;
		} else {
			laser.lowerLimit = centerX;
		}

		super(
			rect,
			"/img/laser.png",
			[laser]
		);
		console.log("Created new Laser");
	}
}
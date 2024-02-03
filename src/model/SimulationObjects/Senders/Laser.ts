import SimulationObject from "@/model/SimulationObject";

export default class Laser extends SimulationObject {
	constructor(x: number, y: number) {
		super(x, y, 34, "/img/laser.png", 300, 100);
	}
}

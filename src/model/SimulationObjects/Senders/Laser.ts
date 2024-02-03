import SimulationObject from "@/model/SimulationObject";

export default class Laser extends SimulationObject {
	constructor(x: number, y: number) {
		super(x, y, 0, "/img/laser.png", 300, 100);
	}
}

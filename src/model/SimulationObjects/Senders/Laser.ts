import SimulationObject from "@/model/SimulationObject";

export default class Laser extends SimulationObject {
	constructor(x: number, y: number) {
		super(x, y, "/img/laser.png", 728, 728);
	}
}

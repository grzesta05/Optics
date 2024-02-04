import SimulationObject from "@/model/SimulationObject.ts";
import Rectangle from "@/classes/Rectangle.ts";
import { LinearFunction } from "@/classes/LinearFunction.ts";

export default abstract class Sender extends SimulationObject {
	public lasers: LinearFunction[] = [];

	protected constructor(rect: Rectangle, imagePath: string, lasers: LinearFunction[]) {
		super(rect, imagePath);
		this.lasers = lasers;
		console.log("Created new Sender with bounds");
	}
}

export function isSender(object: SimulationObject): object is Sender {
	return object instanceof Sender;
}
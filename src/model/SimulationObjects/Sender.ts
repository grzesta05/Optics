import SimulationObject from "@/model/SimulationObject.ts";
import Rectangle from "@/classes/Rectangle.ts";
import { Particle } from "@/classes/Lines/Particle.ts";

export default abstract class Sender extends SimulationObject {
	public particles: Particle[] = [];

	protected constructor(rect: Rectangle, imagePath: string, lasers: Particle[]) {
		super(rect, imagePath);
		this.particles = lasers;
		console.log("Created new Sender with bounds");
	}

	abstract recalculateParticles(): void;
}

export function isSender(object: SimulationObject): object is Sender {
	return object instanceof Sender;
}

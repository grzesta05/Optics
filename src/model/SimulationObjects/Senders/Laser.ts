import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";
import Sender from "@/model/SimulationObjects/Sender.ts";
import { normalizeDegrees, toDegrees } from "@/utils/algebra.ts";
import { Particle } from "@/classes/Lines/Particle.ts";

export default class Laser extends Sender {
	public static imagePath = "/img/laser.png";

	constructor(x: number, y: number, degrees: number) {
		degrees = normalizeDegrees(degrees);
		const rect = Rectangle.fromTopLeftAndSize(new Point(x, y), 100, 100, degrees);

		const startPoint = Point.midpoint(rect.topRight, rect.bottomRight).add(
			new Point(0.1, 0).rotate(toDegrees(rect.rotation))
		);

		// colors that make up white light
		const colors = ["#FF0000"];
		let centerX = startPoint.x;
		let lasers: Particle[] = [];

		for (let i = 0; i < colors.length; i++) {
			const laser = Particle.fromPointAndAngle(startPoint, rect.rotation);
			laser.intensity = 1 / colors.length;
			laser.color = colors[i];

			if (degrees % 360 > 90 && degrees % 360 < 270) {
				laser.upperLimit = centerX;
			} else {
				laser.lowerLimit = centerX;
			}

			lasers.push(laser);
		}
    
		super(
			rect,
			"/img/laser.png",
			lasers,
		);
	}

	public recalculateParticles() {
		const startPoint = Point.midpoint(this.bounds.topRight, this.bounds.bottomRight).add(new Point(0.1, 0).rotate(toDegrees(this.bounds.rotation)));

		let newParticles: Particle[] = [];
		for (const particle of this.particles) {
			const newParticle = particle.cloneWithNewPointAndAngle(startPoint, this.bounds.rotation);
			let degrees = toDegrees(this.bounds.rotation) % 360;
			if (degrees < 0) {
				degrees += 360;
			}
			if (degrees > 90 && degrees < 270) {
				newParticle.upperLimit = startPoint.x;
			} else {
				newParticle.lowerLimit = startPoint.x;
			}
			newParticles.push(newParticle);
		}
		this.particles = newParticles;
	}
}

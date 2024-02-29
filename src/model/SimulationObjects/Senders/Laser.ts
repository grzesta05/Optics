import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";
import Sender from "@/model/SimulationObjects/Sender.ts";
import { normalizeDegrees, toDegrees } from "@/utils/algebra.ts";
import { Particle } from "@/classes/Lines/Particle.ts";
import { positionToCanvas } from "@/utils/canvas";

export default class Laser extends Sender {
	public static imagePath = "/img/laser-pen.png";

	constructor(x: number, y: number, degrees: number) {
		degrees = normalizeDegrees(degrees);
		const rect = Rectangle.fromTopLeftAndSize(new Point(x, y), 150, 50, degrees);

		// colors that make up white light
		const colors = ["#e81416", "#ffa500", "#faeb36", "#79c314", "#487de7", "#4b369d", "#70369d"];
		let lasers: Particle[] = [];

		for (let i = 0; i < colors.length; i++) {
			for (let j = 0; j < 9; j++) {
				const startPoint = Point.midpoint(rect.topRight, rect.bottomRight).add(
					new Point(0.1, (j - 4) * 1).rotate(toDegrees(rect.rotation))
				);
				const centerX = startPoint.x;

				const laser = Particle.fromPointAndAngle(startPoint, rect.rotation);
				laser.color = colors[i];

				if (degrees % 360 > 90 && degrees % 360 < 270) {
					laser.upperLimit = centerX;
				} else {
					laser.lowerLimit = centerX;
				}

				lasers.push(laser);
			}
		}

		super(rect, "/img/laser-pen.png", lasers);
	}

	public recalculateParticles() {
		const startPoint = Point.midpoint(this.bounds.topRight, this.bounds.bottomRight).add(
			new Point(0.1, 0).rotate(toDegrees(this.bounds.rotation))
		);

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

	draw(offset: Point, sizeMultiplier: number): void {
		const context = this.ctx;
		if (!context) {
			return;
		}

		const sizeX = this.bounds.sizeX();
		const sizeY = this.bounds.sizeY();
		const rotation = this.bounds.rotation;
		const center = this.bounds.center();
		const image = this._image;

		const topLeft = new Point(-sizeX / 2, -sizeY / 2).rotate(toDegrees(rotation)).add(center);
		const x = topLeft.x;
		const y = topLeft.y;

		if (toDegrees(rotation) / 360 === 0) {
			context?.drawImage(
				image,
				...positionToCanvas(x, y, offset, sizeMultiplier),
				sizeX * sizeMultiplier,
				sizeY * sizeMultiplier
			);
		} else {
			context?.save();
			context?.translate(...positionToCanvas(center.x, center.y, offset, sizeMultiplier));
			// draw circle at 0,0
			context?.beginPath();
			context?.arc(0, 0, 5, 0, 2 * Math.PI);
			context?.fill();

			context?.rotate(rotation);
			context?.drawImage(
				image,
				(-sizeX * sizeMultiplier) / 2,
				(-sizeY * sizeMultiplier) / 2,
				sizeX * sizeMultiplier,
				sizeY * sizeMultiplier
			);
			context?.restore();
		}
	}
}

export const isLaser = (object: any): object is Laser => {
	return object instanceof Laser;
};

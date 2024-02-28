import SimulationObject from "@/model/SimulationObject.ts";
import Point from "@/classes/Point.ts";
import { normalizeDegrees } from "@/utils/algebra.ts";
import Rectangle from "@/classes/Rectangle.ts";
import RoundedRectangle from "@/classes/RoundedRectangle";
import { positionToCanvas } from "@/utils/canvas";

export default class Lens extends SimulationObject {
	public static imagePath = "/img/mirror.png";
	public size: number = 100;

	constructor(x: number, y: number, degrees: number) {
		degrees = normalizeDegrees(degrees);
		const rect = RoundedRectangle.fromTopLeftAndSize(new Point(x, y), 100, 100, degrees);
		super(rect, "");
	}
	drawBounds(offset: Point, sizeMultiplier: number): void {
		if (!this.ctx) {
			return;
		}
		const bounds = this.bounds as RoundedRectangle;
		console.log(this.bounds instanceof RoundedRectangle);
		this.ctx.strokeStyle = this.selected ? "green" : "yellow";

		this.ctx.lineWidth = 2;

		for (const [from, to] of [
			[bounds.bottomLeft, bounds.bottomRight],
			[bounds.topLeft, bounds.topRight],
		]) {
			const x = from.x;
			const y = from.y;
			const x2 = to.x;
			const y2 = to.y;

			this.ctx.beginPath();
			this.ctx.moveTo(...positionToCanvas(x, y, offset, sizeMultiplier));

			this.ctx.lineTo(...positionToCanvas(x2, y2, offset, sizeMultiplier));
			this.ctx.stroke();
		}

		const { left, right } = bounds.getCurrentRadiusPoints();

		const leftAngle = bounds.domeAngles().left;
		const rightAngle = bounds.domeAngles().right;
		this.ctx.beginPath();

		this.ctx.arc(
			...positionToCanvas(left.x, left.y, offset, sizeMultiplier),
			bounds.leftRadius * sizeMultiplier,
			-Math.PI / 2,
			-Math.PI / 2 + leftAngle
		);
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.arc(
			...positionToCanvas(right.x, right.y, offset, sizeMultiplier),
			bounds.rightRadius * sizeMultiplier,
			Math.PI / 2,
			Math.PI / 2 + rightAngle
		);
		this.ctx.stroke();
	}
	draw(offset: Point, sizeMultiplier: number): void {}
}

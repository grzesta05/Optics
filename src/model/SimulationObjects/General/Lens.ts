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
		this.ctx.moveTo(...positionToCanvas(bounds.centerLeft.x, bounds.centerLeft.y, offset, sizeMultiplier));
		const { left, right } = bounds.getCurrentRadiusPoints();
		const leftAngle = bounds.domeAngles().left;
		const rightAngle = bounds.domeAngles().right;
		this.ctx.arc(left.x, left.y, bounds.leftRadius, 0, leftAngle);
		this.ctx.stroke();
		this.ctx.arc(right.x, right.y, bounds.rightRadius, 0, rightAngle);
		this.ctx.stroke();
	}
	draw(offset: Point, sizeMultiplier: number): void {}
}

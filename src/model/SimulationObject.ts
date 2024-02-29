import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";
import { positionToCanvas } from "@/utils/canvas.ts";
import { toDegrees } from "@/utils/algebra";

export default abstract class SimulationObject {
	imagePath: string;
	_image: HTMLImageElement;

	bounds: Rectangle;

	protected selected: boolean = false;
	protected ctx: CanvasRenderingContext2D | undefined;

	constructor(rect: Rectangle, imagePath: string) {
		this.imagePath = imagePath;
		this.bounds = rect;

		this._image = new Image();
		this._image.src = imagePath;
	}

	public loadImage(imagePath: string) {
		this._image = new Image();
		this._image.src = imagePath;
	}

	public setContext(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	abstract draw(offset: Point, sizeMultiplier: number): void;

	drawBounds(offset: Point, sizeMultiplier: number) {
		if (!this.ctx) {
			return;
		}

		const bounds = this.bounds.points();
		this.ctx.strokeStyle = this.selected ? "green" : "yellow";

		this.ctx.lineWidth = 2;

		console.log("Drawing bounds");

		for (let i = 0; i < 4; i++) {
			const x = bounds[i].x;
			const y = bounds[i].y;
			const x2 = bounds[(i + 1) % 4].x;
			const y2 = bounds[(i + 1) % 4].y;

			this.ctx.beginPath();
			this.ctx.moveTo(...positionToCanvas(x, y, offset, sizeMultiplier));
			this.ctx.lineTo(...positionToCanvas(x2, y2, offset, sizeMultiplier));
			this.ctx.stroke();
		}
	}

	toggleSelected() {
		this.selected = !this.selected;
	}

	get objectProperties() {
		return {
			x: {
				inputType: "number",
				minBound: -Infinity,
				maxBound: Infinity,
				step: 1,
				value: this.roundValue(this.bounds.center().x, 1),
				setProperty: (x: number) => {
					const currentCenter = this.bounds.center();
					const newCenter = new Point(x, this.bounds.center().y);
					const delta = newCenter.subtract(currentCenter);

					const newBounds = this.bounds.moveBy(delta);
					this.bounds = newBounds;
				},
			},
			y: {
				inputType: "number",
				minBound: -Infinity,
				maxBound: Infinity,
				step: 1,
				value: this.roundValue(this.bounds.center().y, 1),
				setProperty: (y: number) => {
					const currentCenter = this.bounds.center();
					const newCenter = new Point(this.bounds.center().x, y);
					const delta = newCenter.subtract(currentCenter);

					const newBounds = this.bounds.moveBy(delta);
					this.bounds = newBounds;
				},
			},
			rotation: {
				inputType: "number",
				minBound: 0,
				maxBound: 360,
				step: 0.1,
				value: this.roundValue(toDegrees(this.bounds.rotation), 0.1),
				setProperty: (rotation: number) => {
					const currentRotation = toDegrees(this.bounds.rotation);
					const rotationDelta = rotation - currentRotation;

					const currentCenter = this.bounds.center();
					const newBounds = this.bounds.rotate(currentCenter, rotationDelta);

					this.bounds = newBounds;
				},
			},
		};
	}

	private roundValue(value: number, step: number) {
		return Math.round(value / step) * step;
	}
}


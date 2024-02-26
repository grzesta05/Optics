import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";
import { positionToCanvas } from "@/utils/canvas.ts";

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
}


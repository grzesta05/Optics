import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";

type DrawCall = (image: CanvasImageSource, topLeft: Point, rotation: number, sizeX: number, sizeY: number) => void;

export default abstract class SimulationObject {
	imagePath: string;
	_image: HTMLImageElement;

	bounds: Rectangle;

	constructor(rect: Rectangle, imagePath: string) {
		this.imagePath = imagePath;
		this.bounds = rect;

		this._image = new Image();
		this._image.src = imagePath;
	}

	draw(drawCall: DrawCall) {
		if (this._image.complete) {
			drawCall(
				this._image,
				this.bounds.center(),
				this.bounds.rotation,
				this.bounds.sizeX(),
				this.bounds.sizeY()
			);
		} else {
			this._image.onload = () => {
				drawCall(
					this._image,
					this.bounds.center(),
					this.bounds.rotation,
					this.bounds.sizeX(),
					this.bounds.sizeY()
				);
			};
		}
	}
}

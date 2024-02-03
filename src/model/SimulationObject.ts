import Rectangle from "@/classes/Rectangle.ts";
import Point from "@/classes/Point.ts";

type DrawCall = (image: CanvasImageSource, x: number, y: number, rotation: number, sizeX: number, sizeY: number) => void;

export default abstract class SimulationObject {
	xPosition: number;
	yPosition: number;
	imagePath: string;
	sizeX: number;
	sizeY: number;
	rotation: number = 0;

	_image: HTMLImageElement;

	boundsRect: Rectangle;
	center: Point;

	constructor(xPosition: number, yPosition: number, rotation: number, imagePath: string, sizeX: number, sizeY: number) {
		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.rotation = rotation;
		this.imagePath = imagePath;
		this.sizeX = sizeX;
		this.sizeY = sizeY;

		this.center = new Point(this.xPosition + this.sizeX / 2, this.yPosition + this.sizeY / 2);
		this.boundsRect = new Rectangle(
			new Point(this.xPosition, this.yPosition),
			new Point(this.xPosition + this.sizeX, this.yPosition),
			new Point(this.xPosition + this.sizeX, this.yPosition + this.sizeY),
			new Point(this.xPosition, this.yPosition + this.sizeY)
		);

		this._image = new Image();
		this._image.src = imagePath;

		this.recalculateBounds();
	}

	recalculateBounds() {
		this.boundsRect = new Rectangle(
			new Point(this.xPosition, this.yPosition),
			new Point(this.xPosition + this.sizeX, this.yPosition),
			new Point(this.xPosition + this.sizeX, this.yPosition + this.sizeY),
			new Point(this.xPosition, this.yPosition + this.sizeY)
		);

		this.boundsRect.rotate(this.center, this.rotation);
	}

	draw(drawCall: DrawCall) {
		if (this._image.complete) {
			drawCall(this._image, this.xPosition, this.yPosition, this.rotation, this.sizeX, this.sizeY);
		} else {
			this._image.onload = () => {
				drawCall(this._image, this.xPosition, this.yPosition, this.rotation, this.sizeX, this.sizeY);
			};
		}
	}
}

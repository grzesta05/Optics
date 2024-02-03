type DrawCall = (image: CanvasImageSource, x: number, y: number, rotation: number, sizeX: number, sizeY: number) => void;
type Point = { x: number, y: number };

export default abstract class SimulationObject {
	xPosition: number;
	yPosition: number;
	imagePath: string;
	sizeX: number;
	sizeY: number;
	rotation: number = 0;

	_image: HTMLImageElement;

	bounds: Point[] = [];

	constructor(xPosition: number, yPosition: number, rotation: number, imagePath: string, sizeX: number, sizeY: number) {
		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.rotation = rotation;
		this.imagePath = imagePath;
		this.sizeX = sizeX;
		this.sizeY = sizeY;

		this._image = new Image();
		this._image.src = imagePath;

		this.recalculateBounds();
	}

	recalculateBounds() {
		const centerX = this.xPosition + this.sizeX / 2;
		const centerY = this.yPosition + this.sizeY / 2;
		const halfWidth = this.sizeX / 2;
		const halfHeight = this.sizeY / 2;

		const cos = Math.cos(this.rotation * Math.PI / 180);
		const sin = Math.sin(this.rotation * Math.PI / 180);

		const topLeft = {
			x: centerX - halfWidth * cos + halfHeight * sin,
			y: centerY - halfWidth * sin - halfHeight * cos
		};
		const topRight = {
			x: centerX + halfWidth * cos + halfHeight * sin,
			y: centerY + halfWidth * sin - halfHeight * cos
		};
		const bottomLeft = {
			x: centerX - halfWidth * cos - halfHeight * sin,
			y: centerY - halfWidth * sin + halfHeight * cos
		};
		const bottomRight = {
			x: centerX + halfWidth * cos - halfHeight * sin,
			y: centerY + halfWidth * sin + halfHeight * cos
		};

		this.bounds = [topLeft, topRight, bottomRight, bottomLeft];
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

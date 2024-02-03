type DrawCall = (image: CanvasImageSource, x: number, y: number, sizeX: number, sizeY: number) => void;

export default abstract class SimulationObject {
	xPosition: number;
	yPosition: number;
	imagePath: string;
	sizeX: number;
	sizeY: number;

	_image: HTMLImageElement;

	constructor(xPosition: number, yPosition: number, imagePath: string, sizeX: number, sizeY: number) {
		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.imagePath = imagePath;
		this.sizeX = sizeX;
		this.sizeY = sizeY;

		this._image = new Image();
		this._image.src = imagePath;
	}

	draw(drawCall: DrawCall) {
		if (this._image.complete) {
			drawCall(this._image, this.xPosition, this.yPosition, this.sizeX, this.sizeY);
		} else {
			this._image.onload = () => {
				drawCall(this._image, this.xPosition, this.yPosition, this.sizeX, this.sizeY);
			};
		}
	}
}

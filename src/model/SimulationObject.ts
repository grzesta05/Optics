export default abstract class SimulationObject {
	xPosition: number;
	yPosition: number;
	path: string;
	sizeX: number;
	sizeY: number;

	constructor(xPosition: number, yPosition: number, path: string, sizeX: number, sizeY: number) {
		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.path = path;
		this.sizeX = sizeX;
		this.sizeY = sizeY;
	}
}

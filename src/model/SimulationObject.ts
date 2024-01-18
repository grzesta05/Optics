export default abstract class SimulationObject {
  private xPosition: number;
  private yPosition: number;

  constructor(xPosition: number, yPosition: number) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
}

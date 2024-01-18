import SimulationObject from "./SimulationObject";

export default class LightSource extends SimulationObject {
  private intensity: number;
  private width: number;
  private color: string;

  constructor(xPosition: number, yPosition: number) {
    super(xPosition, yPosition);

    this.intensity = 1;
    this.width = 4;
    this.color = "white";
  }

  draw(ctx: CanvasRenderingContext2D): void {
      
  }
}

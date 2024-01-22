import SimulationObject from "@/model/SimulationObject";

type Props = {
  objectsToRender: Array<SimulationObject>;
};

export default function SimulationBoard({ objectsToRender }: Props) {
  return <canvas data-testid="SimulationBoard"></canvas>;
}

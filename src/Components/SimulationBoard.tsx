import SimulationObject from "@/model/SimulationObject";
import { useEffect, useState } from "react";

type Props = {
  objectsToRender: Array<SimulationObject> | undefined;
  dimensions: {
    width: number;
    height: number;
  };
};

export default function SimulationBoard({
  objectsToRender,
  dimensions,
}: Props) {
  return <canvas width={dimensions.width} height={dimensions.height} />;
}

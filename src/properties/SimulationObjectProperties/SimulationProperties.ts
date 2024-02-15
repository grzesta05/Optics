import SimulationObject from "@/model/SimulationObject";
import { INPUT_TYPES } from "../types";
import Rectangle from "@/classes/Rectangle";

export const SimulationObjectProperties = {
	minX: { inputType: INPUT_TYPES.number, minBound: -Infinity, maxBound: Infinity },
	minY: { inputType: INPUT_TYPES.number, minBound: -Infinity, maxBound: Infinity },
	rotation: { inputType: INPUT_TYPES.range, minBound: 0, maxBound: 2 },
};

export function mapSimulationObjectToProperties(simulationObject: SimulationObject) {
	return {
		minX: simulationObject.bounds.minX,
		minY: simulationObject.bounds.minY,
		maxX: simulationObject.bounds.maxX,
		maxY: simulationObject.bounds.maxY,
		rotation: simulationObject.bounds.rotation,
	};
}

export function mapPropertiesToSimulationObject(simulationObject: SimulationObject, properties: any) {
	return {
		...simulationObject,
		bounds: { ...simulationObject.bounds, ...properties } as Rectangle,
	} as SimulationObject;
}

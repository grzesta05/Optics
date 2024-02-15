import SimulationObject from "@/model/SimulationObject";
import { INPUT_TYPES } from "../types";
import Point from "@/classes/Point.ts";
import Sender from "@/model/SimulationObjects/Sender.ts";
import { toDegrees } from "@/utils/algebra.ts";

export type PropertiesType = {
	[key: string]: {
		inputType: INPUT_TYPES,
		minBound: number,
		maxBound: number,
		step?: number,
	}
};

const rotationStep = 0.1;

export const SimulationObjectProperties: PropertiesType = {
	x: {inputType: INPUT_TYPES.number, minBound: -Infinity, maxBound: Infinity, step: 1},
	y: {inputType: INPUT_TYPES.number, minBound: -Infinity, maxBound: Infinity, step: 1},
	rotation: {inputType: INPUT_TYPES.range, minBound: 0, maxBound: 360, step: rotationStep},
};

export type SimulationObjectPropertiesType = {
	x: number,
	y: number,
	rotation: number,
};

export function mapSimulationObjectToProperties(simulationObject: SimulationObject): SimulationObjectPropertiesType {
	return {
		x: simulationObject.bounds.center().x,
		y: simulationObject.bounds.center().y,
		rotation: Math.round(toDegrees(simulationObject.bounds.rotation) / rotationStep) * rotationStep,
	};
}

export function changeSimulationObjectByProperties(simulationObject: SimulationObject, properties: SimulationObjectPropertiesType) {
	const currentCenter = simulationObject.bounds.center();
	const newCenter = new Point(properties.x, properties.y);
	const delta = newCenter.subtract(currentCenter);

	const newBounds = simulationObject.bounds.moveBy(delta);
	let rotationDelta = properties.rotation - toDegrees(newBounds.rotation);
	rotationDelta = rotationDelta % 360;
	newBounds.rotate(newBounds.center(), rotationDelta);

	simulationObject.bounds = newBounds;

	if (simulationObject instanceof Sender) {
		simulationObject.recalculateParticles();
	}

	return simulationObject;
}

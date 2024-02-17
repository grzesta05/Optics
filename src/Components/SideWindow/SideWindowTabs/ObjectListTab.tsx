import SimulationObject from "@/model/SimulationObject.ts";

export type Props = {
	renderedObjects: Array<SimulationObject>,
	goToObjectPosition: (chosenObject: SimulationObject) => void
}

export default function ObjectListTab({ renderedObjects, goToObjectPosition }: Props) {
	const renderedObjectElements = renderedObjects.map(renderedObject => (
		<li>
			<h4>{renderedObject.constructor.name}</h4>
			<p>X: {renderedObject.bounds.center().x.toFixed(2)}</p>
			<p>Y: {renderedObject.bounds.center().y.toFixed(2)}</p>
			<button onClick={() => goToObjectPosition(renderedObject)}>Go to</button>
		</li>
	));

	return (
		<ul>{renderedObjectElements}</ul>
	)
}
import { SimulationObjectProperties } from "@/properties/SimulationObjectProperties/SimulationProperties";

type Props = {
	properties: object;
	setProperties: (arg0: object) => void;
};

export default function PropertiesTab({ properties, setProperties }: Props) {
	return (
		<ul>
			{Object.entries(SimulationObjectProperties).map((entry) => {
				return (
					<li key={entry[0]}>
						<label htmlFor={entry[0]}>{entry[0]}</label>
						<input
							step={"any"}
							min={entry[1].minBound}
							max={entry[1].maxBound}
							type={entry[1].inputType}
							id={entry[0]}
							value={properties[entry[0]].toFixed(2)}
							onChange={(e) =>
								setProperties({ ...properties, [entry[0]]: Number.parseFloat(e.target.value) })
							}
						/>
					</li>
				);
			})}
		</ul>
	);
}

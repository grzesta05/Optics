type Props = {
	object: object;
};
enum INPUT_TYPES {
	range = "range",
	number = "number",
}
type Property = {
	inputType: INPUT_TYPES;
	minBound: number;
	maxBound: number;
};

export default function PropertiesTab({ object }: Props) {
	console.log(object);
	const SimulationObjectProperties = {
		x: { inputType: INPUT_TYPES.number, minBound: -Infinity, maxBound: Infinity },
		y: { inputType: INPUT_TYPES.number, minBound: -Infinity, maxBound: Infinity },
		rotate: { inputType: INPUT_TYPES.range, minBound: 0, maxBound: 360 },
	};
	return (
		<ul>
			{Object.entries(SimulationObjectProperties).map((entry) => {
				return (
					<li key={entry[0]}>
						<label htmlFor={entry[0]}>{entry[0]}</label>
						<input
							min={entry[1].minBound}
							max={entry[1].maxBound}
							type={entry[1].inputType}
							id={entry[0]}
						/>
					</li>
				);
			})}
		</ul>
	);
}

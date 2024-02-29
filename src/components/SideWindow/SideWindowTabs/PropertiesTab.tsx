import {
	SimulationObjectProperties,
	SimulationObjectPropertiesType
} from "@/properties/SimulationObjectProperties/SimulationProperties";

type Props = {
	properties: SimulationObjectPropertiesType;
	setProperties: (arg0: SimulationObjectPropertiesType) => void;
};

export default function PropertiesTab({properties, setProperties}: Props) {
	return (
		<ul>
			{Object.entries(SimulationObjectProperties).map((entry) => {
				const name = entry[0] as keyof SimulationObjectPropertiesType;
				const valueOptions = entry[1];
				const value = properties[name];
				return (
					<li key={name}>
						<label htmlFor={name}>{name}</label>
						<input
							step={valueOptions.step ? valueOptions.step : 0.01}
							min={valueOptions.minBound}
							max={valueOptions.maxBound}
							type={valueOptions.inputType}
							id={name}
							value={value.toFixed(2)}
							onChange={(e) => {
								let newValue = Number.parseFloat(e.target.value);
								newValue = Math.max(newValue, valueOptions.minBound);
								newValue = Math.min(newValue, valueOptions.maxBound);
								newValue = Number.isNaN(newValue) ? 0 : newValue;
								if (valueOptions.step) {
									newValue = Math.round(newValue / valueOptions.step) * valueOptions.step;
								}
								console.log(value, newValue);
								if (newValue === value) return;
								setProperties({...properties, [name]: newValue});
							}}
						/>
					</li>
				);
			})}
		</ul>
	);
}

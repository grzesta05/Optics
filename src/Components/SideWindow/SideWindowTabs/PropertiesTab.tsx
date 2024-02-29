import {
	SimulationObjectProperties,
	SimulationObjectPropertiesType,
} from "@/properties/SimulationObjectProperties/SimulationProperties";
import SimulationObject from "@/model/SimulationObject";
import Sender from "@/model/SimulationObjects/Sender";

type Props = {
	selectedObject: SimulationObject;
	setObjectsToRender: React.Dispatch<React.SetStateAction<SimulationObject[]>>;
};

export default function PropertiesTab({ selectedObject, setObjectsToRender }: Props) {
	return (
		<ul>
			{Object.entries(selectedObject.objectProperties).map((entry) => {
				const name = entry[0];
				const data = entry[1];

				return (
					<li key={name}>
						<label htmlFor={name}>{name}</label>
						<input
							type={data.inputType}
							id={name}
							step={data.step}
							min={data.minBound}
							max={data.maxBound}
							value={data.value}
							onChange={(e) => {
								let newValue = Number.parseFloat(e.target.value);
								newValue = Math.max(newValue, data.minBound);
								newValue = Math.min(newValue, data.maxBound);
								newValue = Number.isNaN(newValue) ? 0 : newValue;

								if (data.step) {
									newValue = Math.round(newValue / data.step) * data.step;
								}

								if (newValue === data.value) return;

								if (selectedObject instanceof Sender) {
									selectedObject.recalculateParticles();
								}

								data.setProperty(newValue);

								setObjectsToRender((prev) => {
									const newObjects = prev.map((obj) => {
										if (obj === selectedObject) {
											return selectedObject;
										}
										return obj;
									});
									return newObjects;
								});
							}}
						/>
					</li>
				);
			})}
			{/* {Object.entries(SimulationObjectProperties).map((entry) => {
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
			})} */}
		</ul>
	);
}


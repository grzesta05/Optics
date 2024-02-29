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
		</ul>
	);
}


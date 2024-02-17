import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { FormEvent, useState } from "react";
import SimulationObject from "@/model/SimulationObject.ts";
import UpperMenu from "@components/UpperMenu.tsx";
import PropertiesTab from "@components/SideWindow/SideWindowTabs/PropertiesTab.tsx";
import {
	changeSimulationObjectByProperties,
	mapSimulationObjectToProperties,
	SimulationObjectPropertiesType
} from "@/properties/SimulationObjectProperties/SimulationProperties.ts";
import ObjectListTab from "@components/SideWindow/SideWindowTabs/ObjectListTab.tsx";
import Point from "@/classes/Point.ts";

function Start() {
	const [offset, setOffset] = useState<Point>(new Point(0, 0));
	const [selectedObject, setSelectedObject] = useState<SimulationObject>();
	const [objectsToRender, setObjectsToRender] = useState<Array<SimulationObject>>([
		new Laser(100, 200, 0),
		new Laser(500, 250, 130),
		new Laser(100, 10, 50),
		new Laser(200, 400, 259),
		new Laser(400, 300, 144),
	]);

	const loadJSONSimulationBoard = async (event: FormEvent) => {
		const fileInput = event.target as HTMLInputElement;

		if (fileInput.files?.length === 0) {
			return;
		}

		const uploadedFile = fileInput.files![0];

		try {
			const uploadedObjects = JSON.parse(await uploadedFile.text()) as Array<SimulationObject>;

			setObjectsToRender(
				uploadedObjects.map((boardObject) => {
					const boardObjectCpy = structuredClone(boardObject);

					boardObjectCpy.loadImage(boardObject.imagePath);

					return boardObjectCpy;
				})
			);
		} catch (e) {
			// Show notification later
			console.error("error", e);
		}
	};

	const saveSimulationBoardJSON = () => {
		const simulationBoardJSON = JSON.stringify(objectsToRender);

		const tmpElement = document.createElement("a");

		tmpElement.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(simulationBoardJSON));

		tmpElement.setAttribute('download', "export.json");

		tmpElement.style.display = "none";
		document.body.appendChild(tmpElement);

		tmpElement.click();

		document.body.removeChild(tmpElement);
	};

	const changeOffsetToObjectPosition = (chosenObject: SimulationObject) => {
		setOffset(
			new Point(chosenObject.bounds.center().x, chosenObject.bounds.center().y)
		);
	};

	return (
		<div data-testid="StartScreen" className={styles.simulationContainer}>
      <UpperMenu onImport={loadJSONSimulationBoard} onExport={saveSimulationBoardJSON} onRefresh={() => setObjectsToRender(prev => prev)} />
			<div className={styles.workSpace} >
			<SimulationBoard
				selectObject={setSelectedObject}
				objectsToRender={objectsToRender}
				offset={offset}
				setOffset={setOffset}
			/>
			<SideWindow
				windows={[
					{
						header: "Properties",
						component:
							selectedObject != undefined ? (
								<PropertiesTab
									properties={mapSimulationObjectToProperties(selectedObject)}
									setProperties={(properties: SimulationObjectPropertiesType) => {
										const newObject = changeSimulationObjectByProperties(selectedObject, properties);
										const indexOfTheOldObject = objectsToRender.findIndex(
											(object) => object == selectedObject
										);
										setSelectedObject(newObject as SimulationObject);
										setObjectsToRender((old) => {
											old[indexOfTheOldObject] = newObject as SimulationObject;
											console.log(old);
											return [...old] as SimulationObject[];
										});
									}}
								/>
							) : (
								<></>
							),
					},
					{
						header: "Objects",
						component: (
							<ObjectListTab renderedObjects={objectsToRender} goToObjectPosition={changeOffsetToObjectPosition} />
						)
					}
				]}
			/>
      </div>
		</div>
	);
}

export default Start;

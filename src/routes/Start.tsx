import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/components/SimulationBoard";
import SideWindow from "@/components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { FormEvent, useState } from "react";
import SimulationObject from "@/model/SimulationObject.ts";
import UpperMenu from "@/components/UpperMenu.tsx";
import PropertiesTab from "@/components/SideWindow/SideWindowTabs/PropertiesTab";
import {
	SimulationObjectPropertiesType,
	mapSimulationObjectToProperties,
	changeSimulationObjectByProperties,
} from "@/properties/SimulationObjectProperties/SimulationProperties";

import { useAppSelector } from "@/lib/hooks";

function Start() {
	const [selectedObject, setSelectedObject] = useState<SimulationObject>();
	const [objectsToRender, setObjectsToRender] = useState<Array<SimulationObject>>([
		new Laser(100, 200, 0),
		new Laser(500, 250, 130),
		new Laser(100, 10, 50),
		new Laser(200, 400, 259),
		new Laser(400, 300, 144),
	]);

	const { offset, sizeMultiplier } = useAppSelector((state) => state.canvas);
	const { isShown, position } = useAppSelector((state) => state.contextMenu);

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

		tmpElement.setAttribute("download", "export.json");

		tmpElement.style.display = "none";
		document.body.appendChild(tmpElement);

		tmpElement.click();

		document.body.removeChild(tmpElement);
	};

	const handleSelectObject = (object: SimulationObject | undefined) => {
		console.log("Selected object", object, selectedObject);

		selectedObject?.toggleSelected();
		object?.toggleSelected();

		selectedObject?.drawBounds(offset, sizeMultiplier);
		object?.drawBounds(offset, sizeMultiplier);

		setSelectedObject(object);
	};

	return (
		<div data-testid="StartScreen" className={styles.simulationContainer}>
			<UpperMenu
				onImport={loadJSONSimulationBoard}
				onExport={saveSimulationBoardJSON}
				onRefresh={() => setObjectsToRender((prev) => prev)}
			/>
			<div className={styles.workSpace}>
				<SimulationBoard
					selectObject={handleSelectObject}
					objectsToRender={objectsToRender}
					setObjectsToRender={setObjectsToRender}
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
											const newObject = changeSimulationObjectByProperties(
												selectedObject,
												properties
											);
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
					]}
				/>
			</div>
			{isShown && (
				<div
					style={{
						position: "absolute",
						backgroundColor: "black",
						top: position.y,
						left: position.x,
						borderRadius: "8px",
						color: "white",
						padding: "16px",
						transform: "translate(-50%, -110%)",
					}}
				>
					<p>Context Menu</p>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<button>Add new object</button>
						<button>Option 2</button>
						<button>Option 3</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Start;


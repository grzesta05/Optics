import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/components/SimulationBoard";
import SideWindow from "@/components/SideWindow/SideWindow";
import Frog from "@/model/SimulationObjects/Senders/Frog";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { FormEvent, useState } from "react";
import SimulationObject from "@/model/SimulationObject.ts";
import UpperMenu from "@/components/UpperMenu.tsx";
import PropertiesTab from "@/components/SideWindow/SideWindowTabs/PropertiesTab";

import { useAppSelector } from "@/lib/hooks";
import ToolbarTab from "@/components/SideWindow/SideWindowTabs/ToolbarTab";
import Mirror from "@/model/SimulationObjects/General/Mirror.ts";
import Torch from "@/model/SimulationObjects/Senders/Torch";
import Bulb from "@/model/SimulationObjects/Senders/Bulb";

function Start() {
	const [selectedObject, setSelectedObject] = useState<SimulationObject>();
	const [objectsToRender, setObjectsToRender] = useState<Array<SimulationObject>>([new Laser(0, 0, 0)]);

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

			const newObjectsToRender = uploadedObjects.map(uploadedObject => {
				switch (uploadedObject.objectType) {
					case "Laser":
						//@ts-ignore
						return new Laser(...uploadedObject.constructorArgs);
					case "Mirror":
						//@ts-ignore
						return new Mirror(...uploadedObject.constructorArgs);
					default:
						//@ts-ignore
						return new Laser(...uploadedObject.constructorArgs);
				}
			});

			setObjectsToRender(newObjectsToRender);
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

	const handleNewObject = () => {
		const newObject = new Laser(100, 100, 0);

		handleSelectObject(newObject);

		setObjectsToRender((prev) => {
			return [...prev, newObject];
		});
	};

	return (
		<div data-testid="StartScreen" className={styles.simulationContainer}>
			<UpperMenu
				onImport={loadJSONSimulationBoard}
				onExport={saveSimulationBoardJSON}
				onRefresh={() => {
					setObjectsToRender((prev) => prev);
					console.log("refreshed");
				}}
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
							header: "Toolbar",
							component: <ToolbarTab setObjectsToRender={setObjectsToRender} />,
						},
						{
							header: "Properties",
							component:
								selectedObject != undefined ? (
									<PropertiesTab
										// properties={mapSimulationObjectToProperties(selectedObject)}
										// setProperties={(properties: SimulationObjectPropertiesType) => {
										// 	const newObject = changeSimulationObjectByProperties(
										// 		selectedObject,
										// 		properties
										// 	);
										// 	const indexOfTheOldObject = objectsToRender.findIndex(
										// 		(object) => object == selectedObject
										// 	);
										// 	setSelectedObject(newObject as SimulationObject);
										// 	setObjectsToRender((old) => {
										// 		old[indexOfTheOldObject] = newObject as SimulationObject;
										// 		return [...old] as SimulationObject[];
										// 	});
										// }}
										selectedObject={selectedObject}
										setObjectsToRender={setObjectsToRender}
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
						<button onClick={handleNewObject}>Add Laser</button>
					</div>
				</div>
			)}
			<p
				style={{
					width: "50%",
					color: "white",
					margin: "auto",
					textAlign: "center",
					marginTop: "1vw",
					marginBottom: "1vw",
				}}
			>
				Instructions: To move around the infinite plane, use mouse and scroll button. Use toolbar on the right
				to add components to Plane. Use scroll, to zoom in and out
			</p>
		</div>
	);
}

export default Start;


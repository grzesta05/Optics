import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import {FormEvent, useState} from "react";
import SimulationObject from "@/model/SimulationObject.ts";
import BottomMenu from "@components/BottomMenu.tsx";
import {HTMLInputElement} from "happy-dom";

function Start() {
	const [objectsToRender, setObjectsToRender] = useState<Array<SimulationObject>>([
		new Laser(0, 0),
		new Laser(200, 200),
	]);

	const loadJSONSimulationBoard = async (event: FormEvent) => {
		const fileInput = event.target as unknown as HTMLInputElement;

		if (fileInput.files.length === 0) {
			return;
		}

		const uploadedFile = fileInput.files[0];

		try {
			setObjectsToRender(JSON.parse(await uploadedFile.text()));
		} catch (e) {
			// Show notification later
			console.error('error', e);
		}
	};

	const saveSimulationBoardJSON = () => {
		const simulationBoardJSON = JSON.stringify(objectsToRender);

		const tmpElement = document.createElement("a");

		tmpElement.setAttribute(
			'href',
			'data:text/plain;charset=utf-8,' + encodeURIComponent(simulationBoardJSON)
		);

		tmpElement.setAttribute('download', "niezesrajsiepl.json");

		tmpElement.style.display = 'none';
		document.body.appendChild(tmpElement);

		tmpElement.click();

		document.body.removeChild(tmpElement);
	};

	return (
		<div data-testid="StartScreen" className={styles.simulationContainer}>
			<SimulationBoard
				objectsToRender={objectsToRender}
			/>
			<SideWindow windows={[]}/>
			<BottomMenu onImport={loadJSONSimulationBoard} onExport={saveSimulationBoardJSON} />
		</div>
	);
}

export default Start;

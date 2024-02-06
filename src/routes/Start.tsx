import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { useState } from "react";
import SimulationObject from "@/model/SimulationObject.ts";
import BottomMenu from "@components/BottomMenu.tsx";

function Start() {
	const [objectsToRender, _] = useState<Array<SimulationObject>>([
		new Laser(0, 0),
		new Laser(200, 200),
	]);

	return (
		<div data-testid="StartScreen" className={styles.simulationContainer}>
			<SimulationBoard
				objectsToRender={objectsToRender}
			/>
			<SideWindow windows={[]}/>
			<BottomMenu />
		</div>
	);
}

export default Start;

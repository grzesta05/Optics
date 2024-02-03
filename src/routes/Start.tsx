import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { useState } from "react";
import Point from "@/classes/Point.ts";
import SimulationObject from "@/model/SimulationObject.ts";

function Start() {
	const [offset, setOffset] = useState<Point>(new Point(0, 0));
	const [objectsToRender, _] = useState<Array<SimulationObject>>([
		new Laser(0, 0),
		new Laser(200, 200),
	]);

	return (
		<div data-testid="StartScreen" className={styles.simulationContainer}>
			<SimulationBoard
				setOffset={setOffset}
				offset={offset}
				objectsToRender={objectsToRender}
			/>
			<SideWindow windows={[]}/>
		</div>
	);
}

export default Start;

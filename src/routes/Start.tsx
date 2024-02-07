import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { useState } from "react";
import SimulationObject from "@/model/SimulationObject.ts";

function Start() {
	const [objectsToRender, setObjectsToRender] = useState<Array<SimulationObject>>([
		new Laser(0, 0, 1),
		// new Laser(200, 200, 34),
		new Laser(400, 50, 145),
		new Laser(0, -200, 85),
		new Laser(100, 200, 270),
	]);

	return (
		<div data-testid="StartScreen" className={styles.simulationContainer}>
			<button style={{position: "absolute", top: "0", left: "0"}}
					onClick={() => setObjectsToRender(prev => prev)}>
				Refresh
			</button>
			<SimulationBoard
				objectsToRender={objectsToRender}
			/>
			<SideWindow windows={[]}/>
		</div>
	);
}

export default Start;

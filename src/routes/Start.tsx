import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { useState } from "react";
import SimulationObject from "@/model/SimulationObject.ts";

function Start() {
	const [objectsToRender, setObjectsToRender] = useState<Array<SimulationObject>>([
		new Laser(100, 200, 0),
		new Laser(500, 250, 130),
		new Laser(100, 10, 50),
		new Laser(200, 400, 259),
		new Laser(400, 300, 144),
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

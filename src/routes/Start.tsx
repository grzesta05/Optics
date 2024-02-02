import { Container, MenuLink } from "@components";
import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import { useState } from "react";

function Start() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  return (
    <div data-testid="StartScreen" className={styles.simulationContainer}>
      <SimulationBoard setCursorPosition={setCursorPosition} cursorPosition={cursorPosition} objectsToRender={[new Laser(0,0)]}/>
      <SideWindow windows={[]} />
    </div>
  );
}

export default Start;

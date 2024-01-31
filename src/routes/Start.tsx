import { Container, MenuLink } from "@components";
import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";
import SideWindow from "@/Components/SideWindow/SideWindow";

function Start() {
  return (
    <div data-testid="StartScreen" className={styles.simulationContainer}>
      <SimulationBoard />
      <SideWindow
        windows={[
          {
            component: <>Siema jestem Dawid, chyba nie przyjdę</>,
            header: "Spóźnieni",
          },
        ]}
      />
    </div>
  );
}

export default Start;

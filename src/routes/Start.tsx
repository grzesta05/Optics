import { Container, MenuLink } from "@components";
import styles from "@/styles/routes/Start.module.css";
import SimulationBoard from "@/Components/SimulationBoard";

function Start() {
  return (
    <Container>
      <div data-testid="StartScreen" className={styles.simulationContainer}>
        <SimulationBoard />
      </div>
    </Container>
  );
}

export default Start;

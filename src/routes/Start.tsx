import { SimulationBoard } from "@components";
import styles from "@/styles/routes/Start.module.css";
import { useEffect, useState, useRef } from "react";

function Start() {
  const [objects, setObjects] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      setDimensions({ width, height });
    }
  }, [containerRef]);

  return (
    <div
      data-testid="simulationContainer"
      className={styles.simulationContainer}
      ref={containerRef}
    >
      <SimulationBoard objectsToRender={objects} dimensions={dimensions} />
    </div>
  );
}

export default Start;

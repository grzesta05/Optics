import { ReactElement, useState } from "react";
import styles from "@styles/Components/SideWindow/SideWindowElement.module.css";
type Props = {
  children: ReactElement;
  headerText: string;
};

export default function SideWindowElement({ children, headerText }: Props) {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div>
      <div className={styles.toolbar}>
        <button
          style={{ transform: `rotate(${isHidden ? 90 : -90}deg)` }}
          onClick={() => setIsHidden((v) => !v)}
        >
          &#10095;
        </button>
        <h2>{headerText}</h2>
      </div>
      <div
        className={styles.element}
        style={{ transform: `scaleY(${isHidden ? 0 : 1})` }}
      >
        {children}
      </div>
    </div>
  );
}

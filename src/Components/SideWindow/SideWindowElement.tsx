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
        <button onClick={() => setIsHidden((v) => !v)}></button>
        <h2>{headerText}</h2>
      </div>
      <div
        className={styles.element}
        style={{ height: isHidden ? "0 px" : "auto" }}
      >
        {children}
      </div>
    </div>
  );
}

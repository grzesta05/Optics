import { ReactElement } from "react";
import SideWindowElement from "./SideWindowElement";
import styles from "@styles/Components/SideWindow/SideWindow.module.css";

type Props = {
  windows: Array<ReactElement>;
};

export default function SideWindow({ windows }: Props) {
  return (
    <div className={styles.SideWindow}>
      {windows.map((element) => (
        <SideWindowElement headerText="">{element}</SideWindowElement>
      ))}
    </div>
  );
}

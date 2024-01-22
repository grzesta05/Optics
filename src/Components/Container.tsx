import { ReactNode } from "react";
import styles from "@styles/Components/Container.module.css";

type ContainerProps = {
  children: ReactNode;
};

export const Container = (props: ContainerProps) => {
  return <div className={styles.container}>{props.children}</div>;
};

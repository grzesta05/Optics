import SideWindowElement from "./SideWindowElement";
import styles from "@styles/Components/SideWindow/SideWindow.module.css";
import SideWindowTab from "./SideWindowTabs/ISideWindowTab";

type Props = {
	windows: Array<SideWindowTab>;
};

export default function SideWindow({ windows }: Props) {
	return (
		<div className={styles.SideWindow}>
			{windows.map((element) => (
				<SideWindowElement headerText={element.header}>{element.component}</SideWindowElement>
			))}
		</div>
	);
}

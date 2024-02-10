import React, { useRef } from "react";
import styles from "@styles/Components/BottomMenu.module.css";
import Button from "@components/UI/Button.tsx";

export type BottomMenuEventHandler = {
	buttonTitle: string,
	handler: React.MouseEventHandler
}

export type Props = {
	onImport: React.FormEventHandler,
	onExport: React.MouseEventHandler
};

const BottomMenu = ({ onImport, onExport }: Props) => {
	const simulationBoardInput: React.MutableRefObject<HTMLInputElement | null> = useRef(null);

	const bottomMenuEventHandlers: BottomMenuEventHandler[]  = [
		{
			buttonTitle: "import",
			handler: () => {
				simulationBoardInput.current?.click();
			}
		},
		{
			buttonTitle: "export",
			handler: onExport
		}
	];

	const menuElements = bottomMenuEventHandlers.map(
		({ buttonTitle, handler }, index) => (
		<Button styleType="menutab" onClick={handler} key={index}>
			{buttonTitle}
		</Button>
	));

	return (
		<menu className={styles.menu}>
			<input
				type="file"
				hidden={true}
				name="SimulationBoardJSON"
				ref={simulationBoardInput}
				onChange={onImport}
			/>
			{menuElements}
		</menu>
	);
};

export default BottomMenu;
import React from "react";
import styles from "@styles/Components/BottomMenu.module.css";
import Button from "@components/UI/Button.tsx";

export type BottomMenuEventHandler = {
	buttonTitle: string,
	handler: React.MouseEventHandler
}

export const bottomMenuEventHandlers  = [
	{
		buttonTitle: "import",
		handler: () => {}
	},
	{
		buttonTitle: "export",
		handler: () => {}
	}
];

const BottomMenu = () => {
	const menuElements = bottomMenuEventHandlers.map(({ buttonTitle, handler }) => (
		<Button styleType="menutab" onClick={handler}>
			{buttonTitle}
		</Button>
	));

	return (
		<menu className={styles.menu}>
			{menuElements}
		</menu>
	);
};

export default BottomMenu;
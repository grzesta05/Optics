import React, { ReactNode } from "react";
import styles from "@styles/components/UI/Button.module.css";

export type ButtonStyle = "rect" | "menutab" | "rounded";

export type Props = {
	className?: string,
	onClick?: React.MouseEventHandler,
	style?: React.StyleHTMLAttributes<any>,
	disabled?: boolean,
	styleType?: ButtonStyle
	children: ReactNode,
};

const Button = (props: Props) => {
	const buttonStyleType = props.styleType ?? "rect";

	return (
		<button className={`${styles.button} ${styles[buttonStyleType]}`} { ...props }></button>
	)
};

export default Button;
import React, { ReactNode } from "react";
import styles from "@styles/components/UI/Button.module.css";

export type ButtonStyle = "rect" | "menutab" | "rounded";
export type ButtonColor = "normal" | "error" | "danger" | "success";

export type Props = {
	className?: string,
	onClick?: React.MouseEventHandler,
	style?: React.StyleHTMLAttributes<any>,
	disabled?: boolean,
	styleType?: ButtonStyle
	color?: ButtonColor,
	children: ReactNode,
};

const Button = (props: Props) => {
	const buttonStyleType = props.styleType ?? "rect";
	const buttonColor = props.color ?? "normal";

	return (
		<button className={
			`${styles.button} ${styles[buttonStyleType]} ${styles[buttonColor]}`
		} { ...props } />
	)
};

export default Button;
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "@styles/Components/MenuOption.module.css";

type MenuLinkProps = {
	href: string;
	children: ReactNode;
};

export const MenuLink = (props: MenuLinkProps) => {
	return (
		<Link to={props.href} className={styles.link}>
			{props.children}
		</Link>
	);
};

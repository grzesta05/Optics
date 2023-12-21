import styles from "./Home.module.css";
import { MenuLink } from "../components/MenuLink.tsx";
import { Container } from "../components/Container.tsx";

function Home() {
	const links = {
		"/start": "Start",
		"/about": "About us"
	};

	return (
		<Container>
			<div className={styles.header}>
				<h1>Optics</h1>
			</div>
			<div className={styles.options}>
				{Object.entries(links).map((link) => (
					<MenuLink href={link[0]} key={link[0]}>
						{link[1]}
					</MenuLink>
				))}
			</div>
		</Container>
	);
}

export default Home;

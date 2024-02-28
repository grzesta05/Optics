import SimulationObject from "@/model/SimulationObject";
import styles from "@/styles/Components/SideWindow/SideWindowTabs/ToolbarTab.module.css";
import Mirror from "@/model/SimulationObjects/General/Mirror.ts";
import Frog from "@/model/SimulationObjects/Senders/Frog";

type Props = {
	setObjectsToRender: React.Dispatch<React.SetStateAction<SimulationObject[]>>;
};

export default function ToolbarTab({setObjectsToRender}: Props) {
	const categories = [
		// {categoryName: "Light source", objects: [Laser]},
		{categoryName: "Mirrors", objects: [Mirror]},
		{categoryName: "Frog", objects: [Frog]}
	];

	function addObject<Temp extends SimulationObject>(object: new (...args: any) => Temp): void {
		setObjectsToRender((prev) => [...prev, new object(0, 0, 0)]);
	}

	return (
		<>
			<ul className={styles.categoryList}>
				{categories.map((category) => (
					<li key={category.categoryName}>
						<h3>{category.categoryName}</h3>
						<ul>
							{category.objects.map((object) => (
								<li onClick={() => addObject(object)} className={styles.object} key={object.name}>
									<img src={object.imagePath} alt={object.name}/>
									<h4>{object.name}</h4>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</>
	);
}

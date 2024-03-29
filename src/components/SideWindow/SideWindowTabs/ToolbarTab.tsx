import SimulationObject from "@/model/SimulationObject";
import styles from "@/styles/Components/SideWindow/SideWindowTabs/ToolbarTab.module.css";
import Mirror from "@/model/SimulationObjects/General/Mirror.ts";
import Frog from "@/model/SimulationObjects/Senders/Frog";
import Laser from "@/model/SimulationObjects/Senders/Laser";
import Torch from "@/model/SimulationObjects/Senders/Torch";
import Bulb from "@/model/SimulationObjects/Senders/Bulb";
import Prism from "@/model/SimulationObjects/General/Prism";

type Props = {
	setObjectsToRender: React.Dispatch<React.SetStateAction<SimulationObject[]>>;
};

export default function ToolbarTab({ setObjectsToRender }: Props) {
	const categories = [
		{ categoryName: "Light source", objects: [Laser, Torch, Bulb] },
		{ categoryName: "Mirrors", objects: [Mirror, Prism] },
		{ categoryName: "Frog", objects: [Frog] },
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
								<li style={{listType: "none"}}
									onClick={() => addObject(object as any)}
									className={styles.object}
									key={object.name}
								>
									<img src={object.imagePath} alt={object.name} />
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

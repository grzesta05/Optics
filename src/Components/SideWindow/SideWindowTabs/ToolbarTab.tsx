import SimulationObject from "@/model/SimulationObject";
import Laser from "@/model/SimulationObjects/Senders/Laser";

type Props = {
	setObjectsToRender: React.Dispatch<React.SetStateAction<SimulationObject[]>>;
};

export default function ToolbarTab({ setObjectsToRender }: Props) {
	const categories = [{ categoryName: "Light source", objects: [Laser] }];

	return (
		<>
			<ul>
				{categories.map((category) => (
					<li key={category.categoryName}>
						<h3>{category.categoryName}</h3>
						<ul>
							{category.objects.map((object) => (
								<li key={object.name}>
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

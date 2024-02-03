import SimulationObject from "@/model/SimulationObject";
import { useEffect, useRef, useState } from "react";
import styles from "@styles/Components/SimulationBoard.module.css";

type CursorPosition = {
	x: number;
	y: number;
}
type Props = {
	objectsToRender: Array<SimulationObject>;
	setCursorPosition: (cursorPosition: CursorPosition) => void;
	cursorPosition: CursorPosition
};

const MAX_SIZE_MULTIPLIER = 10;
const MIN_SIZE_MULTIPLIER = 0.001;

export default function SimulationBoard({objectsToRender, cursorPosition, setCursorPosition}: Props) {
	const [sizeMultiplier, setSizeMultiplier] = useState(1);
	const [preMouseDownCursorPosition, setPreMouseDownCursorPosition] = useState({
		x: 0,
		y: 0,
	});
	const [isMouseClicked, setIsMouseClicked] = useState(false);
	const [initialDragPosition, setInitialDragPosition] = useState({
		x: 0,
		y: 0,
	});

	const canvasSize = {
		width: window.innerWidth / 1.2 - 300,
		height: window.innerHeight / 2,
	};

	useEffect(() => {
		console.log(canvasSize);
	}, []);

	const dragStartHandler: React.MouseEventHandler<HTMLCanvasElement> = (
		event
	) => {
		setIsMouseClicked(true);
		setPreMouseDownCursorPosition(cursorPosition);
		setInitialDragPosition({
			x: event.clientX,
			y: event.clientY,
		});
	};
	const dragOnHanlder: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
		if (isMouseClicked) {
			setCursorPosition({
				x:
					preMouseDownCursorPosition.x +
					(initialDragPosition.x - event.clientX) / sizeMultiplier,
				y:
					preMouseDownCursorPosition.y +
					(event.clientY - initialDragPosition.y) / sizeMultiplier,
			});
		}
	};
	const wheelResizeHandle: React.WheelEventHandler<HTMLCanvasElement> = (
		event
	) => {
		if (isMouseClicked) {
			setSizeMultiplier((old) => {
				const newMultiplier = old + event.deltaY / -1000;
				if (newMultiplier < MIN_SIZE_MULTIPLIER) return MIN_SIZE_MULTIPLIER;
				if (newMultiplier > MAX_SIZE_MULTIPLIER) return MAX_SIZE_MULTIPLIER;
				return newMultiplier;
			});
			console.log(sizeMultiplier);
		}
	};
	const dragEndHandler: React.MouseEventHandler<HTMLCanvasElement> = () => {
		setIsMouseClicked(false);
	};

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const ctx = canvasRef.current as HTMLCanvasElement;

		ctx.width = canvasSize.width;
		ctx.height = canvasSize.height;

		const context = ctx.getContext("2d");

		if (!context) return;

		context.strokeStyle = "yellow";

		for (const object of objectsToRender) {
			const bounds = object.bounds;
			for (let i = 0; i < 4; i++) {
				const x = bounds[i].x;
				const y = bounds[i].y;
				const x2 = bounds[(i + 1) % 4].x;
				const y2 = bounds[(i + 1) % 4].y;

				context.beginPath();
				context.moveTo((x - cursorPosition.x) * sizeMultiplier, (y + cursorPosition.y) * sizeMultiplier);
				context.lineTo((x2 - cursorPosition.x) * sizeMultiplier, (y2 + cursorPosition.y) * sizeMultiplier);
				context.stroke();
			}

			object.draw(drawCall);
		}
	}, [canvasRef, objectsToRender, cursorPosition, sizeMultiplier]);

	const drawCall = (image: CanvasImageSource, x: number, y: number, rotation: number, sizeX: number, sizeY: number) => {
		const ctx = canvasRef.current as HTMLCanvasElement;
		const context = ctx.getContext("2d");

		if (rotation / 360 === 0) {
			context?.drawImage(image,
				(x - cursorPosition.x) * sizeMultiplier,
				(y + cursorPosition.y) * sizeMultiplier,
				sizeX * sizeMultiplier,
				sizeY * sizeMultiplier
			);
		} else {
			context?.save();
			context?.translate(
				(x - cursorPosition.x) * sizeMultiplier + sizeX * sizeMultiplier / 2,
				(y + cursorPosition.y) * sizeMultiplier + sizeY * sizeMultiplier / 2
			);
			context?.rotate(rotation * Math.PI / 180);
			context?.drawImage(image,
				-sizeX * sizeMultiplier / 2,
				-sizeY * sizeMultiplier / 2,
				sizeX * sizeMultiplier,
				sizeY * sizeMultiplier
			);
			context?.restore();
		}
	};

	return (
		<canvas
			ref={canvasRef}
			onWheel={wheelResizeHandle}
			onMouseDown={dragStartHandler}
			onMouseMove={dragOnHanlder}
			onMouseUp={dragEndHandler}
			onMouseOut={dragEndHandler}
			data-testid="SimulationBoard"
			style={{
				backgroundPositionX: -cursorPosition.x * sizeMultiplier,
				backgroundPositionY: cursorPosition.y * sizeMultiplier,
				backgroundSize: 100 * sizeMultiplier + "px",
			}}
			className={styles.canvas}
		></canvas>
	);
}

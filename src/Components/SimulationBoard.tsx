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
		width: window.innerWidth / 1.2,
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
	const dragEndHandler: React.MouseEventHandler<HTMLCanvasElement> = (
		event
	) => {
		setIsMouseClicked(false);
	};

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const ctx = canvasRef.current as HTMLCanvasElement;

		ctx.width = canvasSize.width;
		ctx.height = canvasSize.height;

		const context = ctx.getContext("2d");

		if (!context) return;

		context.beginPath();
		context.strokeStyle = "rgba(255,0,0,1)";
		context.lineWidth = 1;
		context.moveTo(0, 0);
		context.lineTo(canvasSize.width, canvasSize.height);
		context.stroke();
		context.closePath();

		context.beginPath();
		context.strokeStyle = "rgba(255,255,0,1)";
		context.lineWidth = 1;
		context.moveTo(0, canvasSize.height);
		context.lineTo(canvasSize.width, 0);
		context.stroke();
		context.closePath();

		// context.moveTo(500, 0);
		// context.lineTo(0,50);
		// context.stroke();
		// context.closePath();
		// for (const object of objectsToRender) {
		//     let image = new Image();
		//     image.src = object.path;
		//     image.onload = () => {
		//       context?.drawImage(
		//         image,
		//         object.xPosition,
		//         object.yPosition,
		//         100,
		//         100
		//       );
		//     };
		//   }
	}, [canvasRef, objectsToRender, cursorPosition, sizeMultiplier]);

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
				backgroundPositionX: -cursorPosition.x,
				backgroundPositionY: cursorPosition.y,
				backgroundSize: 100 * sizeMultiplier + "px",
			}}
			className={styles.canvas}
		></canvas>
	);
}

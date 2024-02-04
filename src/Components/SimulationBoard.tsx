import SimulationObject from "@/model/SimulationObject";
import React, { useEffect, useRef, useState } from "react";
import styles from "@styles/Components/SimulationBoard.module.css";
import Point from "@/classes/Point.ts";
import Rectangle from "@/classes/Rectangle.ts";

type Props = {
	objectsToRender: Array<SimulationObject>;
};

const MAX_SIZE_MULTIPLIER = 10;
const MIN_SIZE_MULTIPLIER = 0.001;

export default function SimulationBoard({objectsToRender}: Props) {
	const [offset, setOffset] = useState<Point>(new Point(0, 0));
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
		setPreMouseDownCursorPosition(offset);
		setInitialDragPosition({
			x: event.clientX,
			y: event.clientY,
		});
	};
	const dragOnHanlder: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
		if (isMouseClicked) {
			setOffset(new Point(
				preMouseDownCursorPosition.x +
				(initialDragPosition.x - event.clientX) / sizeMultiplier,
				preMouseDownCursorPosition.y +
				(event.clientY - initialDragPosition.y) / sizeMultiplier,
			));
		}
	};
	const wheelResizeHandle: React.WheelEventHandler<HTMLCanvasElement> = (
		event
	) => {
		if (isMouseClicked) {
			const canvasPosition = canvasRef.current?.getBoundingClientRect();
			const x = event.clientX - (canvasPosition?.left ?? 0);
			const y = event.clientY - (canvasPosition?.top ?? 0);

			const mousePosition = new Point(
				x / sizeMultiplier + offset.x,
				offset.y - y / sizeMultiplier
			);
			let newMultiplier = sizeMultiplier + event.deltaY / -1000;
			if (newMultiplier < MIN_SIZE_MULTIPLIER) newMultiplier = MIN_SIZE_MULTIPLIER;
			if (newMultiplier > MAX_SIZE_MULTIPLIER) newMultiplier = MAX_SIZE_MULTIPLIER;

			// move the offset so that the mouse position stays the same
			const newMousePosition = new Point(
				x / newMultiplier + offset.x,
				offset.y - y / newMultiplier
			);
			console.log(offset);
			const newOffset = offset.add(mousePosition.subtract(newMousePosition));
			setOffset(newOffset);
			setSizeMultiplier(newMultiplier);

			// refresh the current drag position
			setPreMouseDownCursorPosition(newOffset);
			setInitialDragPosition({
				x: event.clientX,
				y: event.clientY,
			});
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
		const renderBounds = Rectangle.fromTopLeftAndSize(
			new Point(offset.x, -offset.y),
			canvasSize.width / sizeMultiplier,
			canvasSize.height / sizeMultiplier
		);

		let totalObjects = objectsToRender.length;
		let skippedObjects = 0;

		for (const object of objectsToRender) {
			const shouldRender = renderBounds.intersectsOrContains(object.bounds);
			if (!shouldRender) {
				skippedObjects++;
				continue;
			}

			// draw object bounds - mainly for debugging purposes
			const bounds = object.bounds.points();
			for (let i = 0; i < 4; i++) {
				const x = bounds[i].x;
				const y = bounds[i].y;
				const x2 = bounds[(i + 1) % 4].x;
				const y2 = bounds[(i + 1) % 4].y;

				context.beginPath();
				context.moveTo((x - offset.x) * sizeMultiplier, (y + offset.y) * sizeMultiplier);
				context.lineTo((x2 - offset.x) * sizeMultiplier, (y2 + offset.y) * sizeMultiplier);
				context.stroke();
			}

			object.draw(drawCall);
		}

		console.log(`Skipped ${skippedObjects} out of ${totalObjects} objects`);
	}, [canvasRef, objectsToRender, offset, sizeMultiplier]);

	const drawCall = (image: CanvasImageSource, center: Point, rotation: number, sizeX: number, sizeY: number) => {
		const ctx = canvasRef.current as HTMLCanvasElement;
		const context = ctx.getContext("2d");
		const topLeft = new Point(-sizeX / 2, -sizeY / 2).rotate(new Point(0, 0), rotation * Math.PI / 180).add(center);
		const x = topLeft.x;
		const y = topLeft.y;

		if (rotation / 360 === 0) {
			context?.drawImage(image,
				(x - offset.x) * sizeMultiplier,
				(y + offset.y) * sizeMultiplier,
				sizeX * sizeMultiplier,
				sizeY * sizeMultiplier
			);
		} else {
			context?.save();
			context?.translate(
				(center.x - offset.x) * sizeMultiplier,
				(center.y + offset.y) * sizeMultiplier
			);
			// draw circle at 0,0
			context?.beginPath();
			context?.arc(0, 0, 5, 0, 2 * Math.PI);
			context?.fill();

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
				backgroundPositionX: -offset.x * sizeMultiplier,
				backgroundPositionY: offset.y * sizeMultiplier,
				backgroundSize: 100 * sizeMultiplier + "px",
			}}
			className={styles.canvas}
		></canvas>
	);
}

import SimulationObject from "@/model/SimulationObject";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "@styles/Components/SimulationBoard.module.css";
import Point from "@/classes/Point.ts";
import Rectangle from "@/classes/Rectangle.ts";
import { isSender } from "@/model/SimulationObjects/Sender.ts";
import { positionToCanvas } from "@/utils/canvas.ts";
import { toDegrees } from "@/utils/algebra.ts";
import { getAllLinearFunctions } from "@/utils/geometry.ts";

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

	const possibleLimits = useMemo(
		() => getAllLinearFunctions(objectsToRender.map((obj) => obj.bounds)),
		[objectsToRender]
	);

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
	const animationRef = useRef<number>(0);

	useEffect(() => {
		animationRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationRef.current);
	}, [canvasRef, objectsToRender, offset, sizeMultiplier]);

	const animate = () => {
		const ctx = canvasRef.current as HTMLCanvasElement;

		ctx.width = canvasSize.width;
		ctx.height = canvasSize.height;

		const context = ctx.getContext("2d");
		if (!context) return;

		context.clearRect(0, 0, canvasSize.width, canvasSize.height);

		context.strokeStyle = "yellow";
		const renderBounds = Rectangle.fromTopLeftAndSize(
			new Point(offset.x, -offset.y),
			canvasSize.width / sizeMultiplier,
			canvasSize.height / sizeMultiplier
		);

		let totalObjects = objectsToRender.length;
		let skippedObjects = 0;

		console.log(possibleLimits);

		for (const object of objectsToRender) {
			if (isSender(object)) {
				for (const laser of object.lasers) {
					if (!laser.hasIntersectionsCalculated) {
						laser.calculateIntersections(possibleLimits);
					}

					const lowerBound = Math.max(laser.lowerLimit, renderBounds.minX);
					const upperBound = Math.min(laser.upperLimit, renderBounds.maxX);

					if (lowerBound > upperBound) {
						continue;
					}

					const laserStart = new Point(lowerBound, laser.at(lowerBound));
					const laserEnd = new Point(upperBound, laser.at(upperBound));

					context.beginPath();
					context.strokeStyle = laser.color + Math.floor(laser.intensity * 255).toString(16);
					context.lineWidth = 2 * sizeMultiplier;
					context.moveTo(...positionToCanvas(laserStart.x, laserStart.y, offset, sizeMultiplier));
					context.lineTo(...positionToCanvas(laserEnd.x, laserEnd.y, offset, sizeMultiplier));
					context.stroke();

					context.textAlign = "center";
					context.textBaseline = "middle";
					context.fillStyle = "white";

					context.fillText(
						"(" + (laserStart.x.toFixed(2)) + ", " + (laserStart.y.toFixed(2)) + ")",
						...positionToCanvas(laserStart.x, laserStart.y, offset, sizeMultiplier)
					);
					context.fillText(
						"(" + (laserEnd.x.toFixed(2)) + ", " + (laserEnd.y.toFixed(2)) + ")",
						...positionToCanvas(laserEnd.x, laserEnd.y, offset, sizeMultiplier)
					);
				}
			}

			const shouldRender = renderBounds.intersectsOrContains(object.bounds);
			if (!shouldRender) {
				skippedObjects++;
				continue;
			}

			// draw object bounds - mainly for debugging purposes
			const bounds = object.bounds.points();
			context.strokeStyle = "yellow";
			context.lineWidth = sizeMultiplier;
			for (let i = 0; i < 4; i++) {
				const x = bounds[i].x;
				const y = bounds[i].y;
				const x2 = bounds[(i + 1) % 4].x;
				const y2 = bounds[(i + 1) % 4].y;

				context.beginPath();
				context.moveTo(...positionToCanvas(x, y, offset, sizeMultiplier));
				context.lineTo(...positionToCanvas(x2, y2, offset, sizeMultiplier));
				context.stroke();
			}

			object.draw(drawCall);
		}

		console.log(`Skipped ${skippedObjects} out of ${totalObjects} objects`);
	};

	const drawCall = (image: CanvasImageSource, center: Point, rotation: number, sizeX: number, sizeY: number) => {
		const ctx = canvasRef.current as HTMLCanvasElement;
		const context = ctx.getContext("2d");
		const topLeft = new Point(-sizeX / 2, -sizeY / 2).rotate(toDegrees(rotation)).add(center);
		const x = topLeft.x;
		const y = topLeft.y;

		if (toDegrees(rotation) / 360 === 0) {
			context?.drawImage(image,
				...positionToCanvas(x, y, offset, sizeMultiplier),
				sizeX * sizeMultiplier,
				sizeY * sizeMultiplier
			);
		} else {
			context?.save();
			context?.translate(...positionToCanvas(center.x, center.y, offset, sizeMultiplier));
			// draw circle at 0,0
			context?.beginPath();
			context?.arc(0, 0, 5, 0, 2 * Math.PI);
			context?.fill();

			context?.rotate(rotation);
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
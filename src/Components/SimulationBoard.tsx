import SimulationObject from "@/model/SimulationObject";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import styles from "@styles/Components/SimulationBoard.module.css";
import Point from "@/classes/Point.ts";
import Rectangle from "@/classes/Rectangle.ts";
import { isSender } from "@/model/SimulationObjects/Sender.ts";
import { canvasToPosition, positionToCanvas } from "@/utils/canvas.ts";
import { getAllSurfaces } from "@/utils/geometry.ts";
import { Particle } from "@/classes/Lines/Particle.ts";
import Laser from "@/model/SimulationObjects/Senders/Laser";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setOffset, setSizeMultiplier } from "@/lib/slices/canvasSlice";
import { setIsShown, setPosition } from "@/lib/slices/contextMenuSlice";

type Props = {
	objectsToRender: Array<SimulationObject>;
	selectObject: (object: SimulationObject | undefined) => void;
	setObjectsToRender: Dispatch<SetStateAction<Array<SimulationObject>>>;
};

const MAX_SIZE_MULTIPLIER = 10;
const MIN_SIZE_MULTIPLIER = 0.001;

export default function SimulationBoard({ objectsToRender, selectObject, setObjectsToRender }: Props) {
	const offset = useAppSelector((state) => state.canvas.offset);
	const sizeMultiplier = useAppSelector((state) => state.canvas.sizeMultiplier);
	const dispatch = useAppDispatch();

	const [preMouseDownCursorPosition, setPreMouseDownCursorPosition] = useState({
		x: 0,
		y: 0,
	});
	const [isMouseClicked, setIsMouseClicked] = useState(false);
	const [initialDragPosition, setInitialDragPosition] = useState({
		x: 0,
		y: 0,
	});
	const [selectedObject, setSelectedObject] = useState<SimulationObject>();
	const [lastMousePosition, setLastMousePosition] = useState(new Point(0, 0));

	const [canvasSize, setCanvasSize] = useState({
		width: window.innerWidth * 0.8 - 300,
		height: window.innerHeight * 0.5,
	});

	const possibleLimits = useMemo(() => getAllSurfaces(objectsToRender.map((obj) => obj.bounds)), [objectsToRender]);

	useEffect(() => {
		for (let object of objectsToRender) {
			const ctx = canvasRef.current?.getContext("2d");

			if (ctx) {
				object.setContext(ctx);
			}

			if (isSender(object)) {
				for (let particle of object.particles) {
					particle.resetCalculations();
				}
			}
		}
	}, [objectsToRender]);

	const dragStartHandler: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
		setIsMouseClicked(true);
		setPreMouseDownCursorPosition(offset);
		setInitialDragPosition({
			x: event.clientX,
			y: event.clientY,
		});
	};

	const dragOnHanlder: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
		if (isMouseClicked && !selectedObject) {
			const point = new Point(
				preMouseDownCursorPosition.x + (initialDragPosition.x - event.clientX) / sizeMultiplier,
				preMouseDownCursorPosition.y + (event.clientY - initialDragPosition.y) / sizeMultiplier
			);

			dispatch(setOffset(point));
		} else if (isMouseClicked && selectedObject) {
			if (lastMousePosition.x === 0 && lastMousePosition.y === 0) {
				lastMousePosition.x = event.clientX;
				lastMousePosition.y = event.clientY;
			}

			const diffX = (event.clientX - lastMousePosition.x) / sizeMultiplier;
			const diffY = (event.clientY - lastMousePosition.y) / sizeMultiplier;

			lastMousePosition.x = event.clientX;
			lastMousePosition.y = event.clientY;

			selectedObject.bounds.moveBy(new Point(diffX, diffY));

			if (selectedObject instanceof Laser) {
				(selectedObject as Laser).recalculateParticles();
			}

			setObjectsToRender([...objectsToRender]);
		}
	};
	const wheelResizeHandle: React.WheelEventHandler<HTMLCanvasElement> = (event) => {
		const canvasPosition = canvasRef.current?.getBoundingClientRect();
		const x = event.clientX - (canvasPosition?.left ?? 0);
		const y = event.clientY - (canvasPosition?.top ?? 0);

		const mousePosition = new Point(x / sizeMultiplier + offset.x, offset.y - y / sizeMultiplier);
		let newMultiplier = sizeMultiplier + event.deltaY / -1000;
		if (newMultiplier < MIN_SIZE_MULTIPLIER) newMultiplier = MIN_SIZE_MULTIPLIER;
		if (newMultiplier > MAX_SIZE_MULTIPLIER) newMultiplier = MAX_SIZE_MULTIPLIER;

		// move the offset so that the mouse position stays the same
		const newMousePosition = new Point(x / newMultiplier + offset.x, offset.y - y / newMultiplier);
		const newOffset = offset.add(mousePosition.subtract(newMousePosition));
		setOffset(newOffset);
		dispatch(setSizeMultiplier(newMultiplier));

		// refresh the current drag position
		setPreMouseDownCursorPosition(newOffset);
		setInitialDragPosition({
			x: event.clientX,
			y: event.clientY,
		});
	};
	const dragEndHandler: React.MouseEventHandler<HTMLCanvasElement> = () => {
		setIsMouseClicked(false);
		setLastMousePosition(new Point(0, 0));
		setSelectedObject(undefined);
	};

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);

	useEffect(() => {
		animationRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationRef.current);
	}, [canvasRef, objectsToRender, offset, sizeMultiplier]);

	const animate = () => {
		const ctx = canvasRef.current as HTMLCanvasElement;

		console.log(ctx.width);

		const context = ctx.getContext("2d");
		if (!context) return;

		context.clearRect(0, 0, canvasSize.width, canvasSize.height);

		context.strokeStyle = "yellow";
		const renderBounds = Rectangle.fromTopLeftAndSize(
			new Point(offset.x, -offset.y),
			canvasSize.width / sizeMultiplier,
			canvasSize.height / sizeMultiplier
		);

		for (const object of objectsToRender) {
			if (isSender(object)) {
				for (const particle of object.particles as Particle[]) {
					if (!particle.hasReflectionsCalculated) {
						particle.calculateReflections(possibleLimits, null);
					}

					for (const child of particle.childReflections) {
						if (child.childReflections.length > 0) {
							console.log("child has children");
						}

						drawLaser(child, renderBounds, context);
					}

					drawLaser(particle, renderBounds, context);
				}
			}

			const shouldRender = renderBounds.intersectsOrContains(object.bounds);
			if (!shouldRender) {
				continue;
			}

			object.drawBounds(offset, sizeMultiplier);

			object.draw(offset, sizeMultiplier);
		}
	};

	const drawLaser = (particle: Particle, renderBounds: Rectangle, context: CanvasRenderingContext2D) => {
		const lowerBound = Math.max(particle.lowerLimit, renderBounds.minX);
		const upperBound = Math.min(particle.upperLimit, renderBounds.maxX);

		if (lowerBound > upperBound) {
			return;
		}

		const laserStart = new Point(lowerBound, particle.at(lowerBound));
		const laserEnd = new Point(upperBound, particle.at(upperBound));

		context.beginPath();
		context.strokeStyle = particle.color + Math.floor(particle.intensity * 255).toString(16);
		context.lineWidth = 2 * sizeMultiplier;
		context.moveTo(...positionToCanvas(laserStart.x, laserStart.y, offset, sizeMultiplier));
		context.lineTo(...positionToCanvas(laserEnd.x, laserEnd.y, offset, sizeMultiplier));
		context.stroke();

		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "50px Arial";
		context.fillStyle = particle.color;

		// if (particle.direction == Direction.Left) {
		// 	context.fillText("←", ...positionToCanvas(laserEnd.x, laserEnd.y, offset, sizeMultiplier));
		// 	return;
		// }

		// context.fillText("→", ...positionToCanvas(laserStart.x, laserStart.y, offset, sizeMultiplier));
	};

	const elementDragStartHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const target = e.target as HTMLCanvasElement;

		const mousePosition = {
			x: e.clientX - target.getBoundingClientRect().left,
			y: e.clientY - target.getBoundingClientRect().top,
		};
		const position = new Point(...canvasToPosition(mousePosition.x, mousePosition.y, offset, sizeMultiplier));

		const selectedObject = objectsToRender.find((object) => {
			return object.bounds.contains(position);
		});

		selectObject(selectedObject);

		if (!selectedObject) {
			return;
		}

		setInitialDragPosition({
			x: e.clientX,
			y: e.clientY,
		});
		setIsMouseClicked(true);
		setSelectedObject(selectedObject);
	};

	const mouseDownHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const button = e.button === 0 ? "left" : e.button === 1 ? "middle" : "right";
		dispatch(setIsShown(false));

		switch (button) {
			case "middle":
				dragStartHandler(e);
				break;

			case "left":
				elementDragStartHandler(e);
				break;

			default:
				break;
		}
	};

	const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
		e.preventDefault();

		const { clientX, clientY } = e;

		dispatch(setPosition({ x: clientX, y: clientY }));
		dispatch(setIsShown(true));
	};

	const handleResize = () => {
		setCanvasSize({
			width: window.innerWidth * 0.8 - 300,
			height: window.innerHeight * 0.5,
		});

		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth * 0.8 - 300;
		canvas.height = window.innerHeight * 0.5;

		animate();
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			canvas.width = canvasSize.width;
			canvas.height = canvasSize.height;
		}

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			// onClick={clickOnObject}
			onWheel={wheelResizeHandle}
			onMouseDown={mouseDownHandler}
			onMouseMove={dragOnHanlder}
			onMouseUp={dragEndHandler}
			onMouseOut={dragEndHandler}
			onContextMenu={handleContextMenu}
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


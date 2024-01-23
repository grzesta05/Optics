import SimulationObject from "@/model/SimulationObject";
import { useState } from "react";
import styles from "@styles/Components/SimulationBoard.module.css";
type Props = {
  objectsToRender: Array<SimulationObject>;
};

export default function SimulationBoard({ objectsToRender }: Props) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
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
      console.log(cursorPosition.x, cursorPosition.y);
    }
  };
  const wheelResizeHandle: React.WheelEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (isMouseClicked) {
      setSizeMultiplier((old) => {
        const newMultiplier = old + event.deltaY / -1000;
        if (newMultiplier < 0.001) return 0.001;
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
  return (
    <canvas
      onWheel={wheelResizeHandle}
      onMouseDown={dragStartHandler}
      onMouseMove={dragOnHanlder}
      onMouseUp={dragEndHandler}
      onMouseOut={dragEndHandler}
      data-testid="SimulationBoard"
      style={{
        width: canvasSize.width + "px",
        height: canvasSize.height + "px",
        backgroundPositionX: -cursorPosition.x,
        backgroundPositionY: cursorPosition.y,
        backgroundSize: 100 * sizeMultiplier + "px",
      }}
      className={styles.canvas}
    ></canvas>
  );
}

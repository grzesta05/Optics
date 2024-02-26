import Point from "@/classes/Point";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CanvasState {
	offset: Point;
	sizeMultiplier: number;
}

const initialState: CanvasState = {
	offset: new Point(0, 0),
	sizeMultiplier: 1,
};

const canvasSlice = createSlice({
	name: "canvas",
	initialState,
	reducers: {
		setOffset: (state, action: PayloadAction<Point>) => {
			state.offset = action.payload;
		},
		setSizeMultiplier: (state, action: PayloadAction<number>) => {
			state.sizeMultiplier = action.payload;
		},
	},
});

export const { setOffset, setSizeMultiplier } = canvasSlice.actions;

export default canvasSlice.reducer;


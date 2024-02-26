import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContextMenuState {
	isShown: boolean;
	position: { x: number; y: number };
}

const initialState: ContextMenuState = {
	isShown: false,
	position: { x: 0, y: 0 },
};

const contextMenuSlice = createSlice({
	name: "contextMenu",
	initialState,
	reducers: {
		setIsShown: (state, action: PayloadAction<boolean>) => {
			state.isShown = action.payload;
		},
		setPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
			state.position = action.payload;
		},
	},
});

export const { setIsShown, setPosition } = contextMenuSlice.actions;

export default contextMenuSlice.reducer;


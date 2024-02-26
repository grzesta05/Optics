import { configureStore } from "@reduxjs/toolkit";
import canvasSlice from "./slices/canvasSlice";
import contextMenuSlice from "./slices/contextMenuSlice";

const store = configureStore({
	reducer: {
		canvas: canvasSlice,
		contextMenu: contextMenuSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["canvas/setOffset", "canvas/setSizeMultiplier"],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


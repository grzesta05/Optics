export enum INPUT_TYPES {
	range = "range",
	number = "number",
}
export type Property = {
	inputType: INPUT_TYPES;
	minBound: number;
	maxBound: number;
};

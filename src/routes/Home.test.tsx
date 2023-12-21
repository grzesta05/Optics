import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { BrowserRouter } from "react-router-dom";

afterEach(() => {
	document.body.innerHTML = "";
});

describe("Home", () => {
	test("renders", () => {
		render(
			<BrowserRouter>
				<Home/>
			</BrowserRouter>
		);

		expect(screen.getByText("Optics")).toBeDefined();
	});

	test("renders link to About us", () => {
		render(
			<BrowserRouter>
				<Home/>
			</BrowserRouter>
		);

		expect(screen.getByText("About us")).toBeDefined();
	});

	test("renders link to Start", () => {
		render(
			<BrowserRouter>
				<Home/>
			</BrowserRouter>
		);

		expect(screen.getByText("Start")).toBeDefined();
	});
});
